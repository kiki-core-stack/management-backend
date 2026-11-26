import type { AuthRouteDefinition } from '@kcs-project/pack/hono-backend/types/auth';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import type { Context } from 'hono';
import type { QueryFilter } from 'mongoose';

import type { RouteMeta } from '@/core/types/route';
import { getAdminPermission } from '@/libs/admin/permission';

// Functions
export function defineAdminAuthManagementRoute(route: AuthRouteDefinition) {
    return defineAdminAuthRoute(route, adminPermissions.admin.account.manageSecurity);
}

export function defineAdminAuthRoute(route: AuthRouteDefinition, permission: RouteMeta['permission'] = 'ignore') {
    return defineRoute({
        ...route.meta,
        permission,
    })(...route.handlers as [AuthRouteDefinition['handlers'][number]]);
}

/**
 * Finds the admin of the route param `id` that the current admin may manage, their own included; only unrestricted
 * admins may manage super admins.
 */
export async function findManageableAdminOrThrow(ctx: Context) {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;
    return await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);
}
