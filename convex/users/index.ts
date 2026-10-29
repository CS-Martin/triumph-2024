import { internalMutation, internalQuery, mutation, query } from '../_generated/server';
import { importBatchArgs, importBatchHandler } from './mutations/importBatch';
import { linkAccountArgs, linkAccountHandler } from './mutations/linkAccount';
import { backfillUuidsHandler } from './mutations/backfillUuids';
import { markPasswordChangedHandler } from './mutations/markPasswordChanged';
import { getByCollegePaginatedArgs, getByCollegePaginatedHandler } from './queries/getByCollegePaginated';
import { getBySlugArgs, getBySlugHandler } from './queries/getBySlug';
import { getMeHandler } from './queries/getMe';
import { listKeysHandler } from './queries/listKeys';
import { searchArgs, searchHandler } from './queries/search';

// Queries
export const getByCollegePaginated = query({ args: getByCollegePaginatedArgs, handler: getByCollegePaginatedHandler });
export const getBySlug = query({ args: getBySlugArgs, handler: getBySlugHandler });
export const getMe = query({ handler: getMeHandler });
export const search = query({ args: searchArgs, handler: searchHandler });

// Mutations
export const markPasswordChanged = mutation({ handler: markPasswordChangedHandler });

// Internal mutations (scripts only)
export const importBatch = internalMutation({ args: importBatchArgs, handler: importBatchHandler });
export const linkAccount = internalMutation({ args: linkAccountArgs, handler: linkAccountHandler });
export const backfillUuids = internalMutation({ handler: backfillUuidsHandler });
export const listKeys = internalQuery({ handler: listKeysHandler });
