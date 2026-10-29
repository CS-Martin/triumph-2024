/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_auth from "../lib/auth.js";
import type * as lib_colleges from "../lib/colleges.js";
import type * as lib_schoolLevels from "../lib/schoolLevels.js";
import type * as users_index from "../users/index.js";
import type * as users_mutations_importBatch from "../users/mutations/importBatch.js";
import type * as users_mutations_linkAccount from "../users/mutations/linkAccount.js";
import type * as users_mutations_markPasswordChanged from "../users/mutations/markPasswordChanged.js";
import type * as users_publicProfile from "../users/publicProfile.js";
import type * as users_queries_getByCollegePaginated from "../users/queries/getByCollegePaginated.js";
import type * as users_queries_getBySlug from "../users/queries/getBySlug.js";
import type * as users_queries_getMe from "../users/queries/getMe.js";
import type * as users_queries_search from "../users/queries/search.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/auth": typeof lib_auth;
  "lib/colleges": typeof lib_colleges;
  "lib/schoolLevels": typeof lib_schoolLevels;
  "users/index": typeof users_index;
  "users/mutations/importBatch": typeof users_mutations_importBatch;
  "users/mutations/linkAccount": typeof users_mutations_linkAccount;
  "users/mutations/markPasswordChanged": typeof users_mutations_markPasswordChanged;
  "users/publicProfile": typeof users_publicProfile;
  "users/queries/getByCollegePaginated": typeof users_queries_getByCollegePaginated;
  "users/queries/getBySlug": typeof users_queries_getBySlug;
  "users/queries/getMe": typeof users_queries_getMe;
  "users/queries/search": typeof users_queries_search;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
