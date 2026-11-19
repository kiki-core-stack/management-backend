import type { AuthRouteDefinition } from '@kcs-project/pack/hono-backend/types/auth';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import type { Context } from 'hono';
import type { QueryFilter } from 'mongoose';

import type { RouteMeta } from '@/core/types/route';
import { getAdminPermission } from '@/libs/admin/permission';

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

/**
 * Resolves the admin of the route param `id` whose security the current admin may manage, their own included; only
 * unrestricted admins may manage super admins.
 */
export async function getSecurityManageableAdminId(ctx: Context) {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;
    return (await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter)).id;
}
