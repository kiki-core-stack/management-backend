import type { ArrayValues } from 'type-fest';

import { adminPermissionCatalog } from './admin';

/**
 * Permission catalogs of every principal type, keyed by the principal's route segment (`/api/<principal>/*`).
 *
 * Adding a principal type: create `./<principal>/` (same structure as `./admin/`) and list its catalog here. Everything
 * else (`PermissionKey`, route meta typing, route wiring checks) derives from this map.
 */
export const permissionCatalogs = { admin: adminPermissionCatalog } as const;

export type PermissionKey = {
    [P in PrincipalType]: ArrayValues<(typeof permissionCatalogs)[P]['keys']>;
}[PrincipalType];

export type PrincipalType = keyof typeof permissionCatalogs;
