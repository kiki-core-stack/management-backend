import { AdminModel } from '@kcs-project/pack/models/admin';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

export default defineRoute({ permission: adminPermissions.admin.role.delete })(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        AdminRoleModel,
        undefined,
        undefined,
        async (adminRole) => {
            if (await AdminModel.exists({ roles: adminRole._id })) throwApiError(apiErrors.common.conflict);
        },
    );

    return ctx.createApiSuccessResponse();
});
