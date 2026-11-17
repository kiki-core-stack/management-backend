import type { AuthRouteDefinition } from '@kcs-project/pack/hono-backend/types/auth';

import type { RouteMeta } from '@/core/types/route';

// Functions

/**
 * Forwards a pack auth management route; requires the permission to manage admin accounts' security.
 */
export function defineAdminAuthManagementRoute(route: AuthRouteDefinition) {
    return defineAdminAuthRoute(route, adminPermissions.admin.account.manageSecurity);
}

/**
 * Forwards a pack auth route from a route file: `export default defineAdminAuthRoute(adminAuth.routes.logout)`.
 */
export function defineAdminAuthRoute(route: AuthRouteDefinition, permission: RouteMeta['permission'] = 'ignore') {
    return defineRoute({
        ...route.meta,
        permission,
    })(...route.handlers as [AuthRouteDefinition['handlers'][number]]);
}
