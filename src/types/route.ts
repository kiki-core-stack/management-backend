import type { PermissionKey } from '@/constants/permissions';

declare module '@/core/types/route' {
    // Add per-route meta fields for defineRoute(meta); route middlewares read them via `route.meta`.
    // Required fields make the defineRoute argument required.
    interface RouteMeta {
        noLoginRequired?: true;

        /**
         * Permission required by the route (e.g. `adminPermissions.admin.create`), or `ignore` to skip the check.
         * The key must belong to the catalog of the principal type in the route path (`/api/<principal>/*`).
         */
        permission: 'ignore' | PermissionKey;
    }
}

export {};
