import { deleteAuthPrincipalData } from '@kcs-project/pack/libs/auth/principal';

import { adminAuthRealm } from '@/constants/admin/auth';
import { findManageableAdminOrThrow } from '@/libs/admin/auth';
import { clearAdminPermissionCache } from '@/libs/admin/permission';

export default defineRoute({ permission: adminPermissions.admin.account.delete })(async (ctx) => {
    const admin = await findManageableAdminOrThrow(ctx);
    if (admin._id.equals(ctx.adminId)) throwApiError(apiErrors.common.conflict);
    await admin.deleteOne();
    await deleteAuthPrincipalData(adminAuthRealm, admin.id);
    clearAdminPermissionCache(admin.id).catch(logger.error);
    return ctx.createApiSuccessResponse();
});
