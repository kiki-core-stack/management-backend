import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import type { QueryFilter } from 'mongoose';

import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';
import {
    clearAdminPermissionCache,
    getAdminPermission,
} from '@/libs/admin/permission';

export default defineRoute({ permission: adminPermissions.admin.account.delete })(async (ctx) => {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;

    const adminId = await getDefaultMongooseConnection().transaction(async (session) => {
        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter, undefined, { session });
        if (admin._id.equals(ctx.adminId)) throwApiError(apiErrors.common.conflict);
        if (await AdminModel.countDocuments(undefined, { session }) === 1) throwApiError(apiErrors.common.conflict);
        await admin.deleteOne({ session });
        return admin._id.toHexString();
    });

    adminAuthenticationSessionStore.revokeAll(adminId).catch(logger.error);
    clearAdminPermissionCache(adminId).catch(logger.error);
    return ctx.createApiSuccessResponse();
});
