import { deleteAuthPrincipalData } from '@kcs-project/pack/libs/auth/principal';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import type { QueryFilter } from 'mongoose';

import { adminAuthRealm } from '@/constants/admin/auth';
import {
    clearAdminPermissionCache,
    getAdminPermission,
} from '@/libs/admin/permission';

export default defineRoute({ permission: adminPermissions.admin.account.delete })(async (ctx) => {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;

    const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);
    if (admin._id.equals(ctx.adminId)) throwApiError(apiErrors.common.conflict);
    await admin.deleteOne();
    await deleteAuthPrincipalData(adminAuthRealm, admin.id);
    clearAdminPermissionCache(admin.id).catch(logger.error);
    return ctx.createApiSuccessResponse();
});
