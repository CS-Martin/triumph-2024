import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT ?? '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY ?? '',
    secretAccessKey: process.env.R2_SECRET_KEY ?? '',
  },
});

const REQUIRED_ENV = ['R2_BUCKET_NAME', 'R2_ENDPOINT', 'R2_ACCESS_KEY', 'R2_SECRET_KEY'] as const;

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  if (!path || path.length === 0) {
    return Response.json({ error: 'No path provided' }, { status: 400 });
  }

  const missingEnv = REQUIRED_ENV.find((name) => !process.env[name]);
  if (missingEnv) {
    return Response.json({ error: `${missingEnv} environment variable is not set` }, { status: 500 });
  }

  const key = path.join('/');

  try {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        IfNoneMatch: request.headers.get('if-none-match') ?? undefined,
      }),
    );

    if (!response.Body) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }

    const headers = new Headers({
      'Content-Type': response.ContentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(key.split('/').pop() ?? key)}`,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    });
    if (response.ETag) headers.set('ETag', response.ETag);
    if (response.ContentLength !== undefined) headers.set('Content-Length', String(response.ContentLength));

    return new Response(response.Body.transformToWebStream(), { headers });
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;

    if (status === 304) {
      return new Response(null, { status: 304 });
    }

    if (name === 'NoSuchKey' || status === 404) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    console.error('R2 Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
