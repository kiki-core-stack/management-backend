import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

export const routePermission = 'admin admin.role.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        AdminRoleModel,
        undefined,
        undefined,
        async (adminRole) => {
            if (await AdminModel.exists({ roles: adminRole })) throwApiError(409);
        },
    );

    return ctx.createApiSuccessResponse();
});
