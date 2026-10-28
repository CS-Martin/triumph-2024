import { internalMutation, query } from '../_generated/server';
import { importBatchArgs, importBatchHandler } from './mutations/importBatch';
import { getByCollegePaginatedArgs, getByCollegePaginatedHandler } from './queries/getByCollegePaginated';
import { getBySlugArgs, getBySlugHandler } from './queries/getBySlug';
import { getMeHandler } from './queries/getMe';
import { searchArgs, searchHandler } from './queries/search';

// Queries
export const getByCollegePaginated = query({ args: getByCollegePaginatedArgs, handler: getByCollegePaginatedHandler });
export const getBySlug = query({ args: getBySlugArgs, handler: getBySlugHandler });
export const getMe = query({ handler: getMeHandler });
export const search = query({ args: searchArgs, handler: searchHandler });

// Internal mutations (scripts only)
export const importBatch = internalMutation({ args: importBatchArgs, handler: importBatchHandler });
