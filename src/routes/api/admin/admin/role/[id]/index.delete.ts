import { AdminModel } from '@kcs-project/pack/models/admin';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

export default defineRoute({ permission: adminPermissions.admin.role.delete })(async (ctx) => {
    const adminRole = await AdminRoleModel.findByRouteIdOrThrowNotFoundError(ctx);
    if (await AdminModel.exists({ roles: adminRole._id })) throwApiError(apiErrors.common.conflict);
    await adminRole.deleteOne();
    return ctx.createApiSuccessResponse();
});
