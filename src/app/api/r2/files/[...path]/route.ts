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

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  if (!path || path.length === 0) {
    return Response.json({ error: 'No path provided' }, { status: 400 });
  }

  const key = path.join('/');

  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    return Response.json({ error: 'R2_BUCKET_NAME environment variable is not set' }, { status: 500 });
  }

  const endpoint = process.env.R2_ENDPOINT;
  if (!endpoint) {
    return Response.json({ error: 'R2_ENDPOINT environment variable is not set' }, { status: 500 });
  }

  const accessKey = process.env.R2_ACCESS_KEY;
  if (!accessKey) {
    return Response.json({ error: 'R2_ACCESS_KEY environment variable is not set' }, { status: 500 });
  }

  const secretKey = process.env.R2_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: 'R2_SECRET_KEY environment variable is not set' }, { status: 500 });
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await r2.send(command);

    if (!response.Body) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }

    return new Response(response.Body as any, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${key.split('/').pop()}"`,
      },
    });
  } catch (error) {
    console.error('R2 Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
