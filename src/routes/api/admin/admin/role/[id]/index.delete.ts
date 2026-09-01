import { AdminModel } from '@kcs-project/pack/models/admin';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

export const routePermission = 'admin admin.role.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        AdminRoleModel,
        undefined,
        undefined,
        async (adminRole) => {
            if (await AdminModel.exists({ roles: adminRole._id })) throwApiError(409);
        },
    );

    return ctx.createApiSuccessResponse();
});
