import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

export const routePermission = 'admin admin.role.list';

export default defineRouteHandlers(async (ctx) => await paginateModelDataWithApiResponse(
    ctx,
    AdminRoleModel,
    undefined,
    { populate: populateCreatedAndEditedByAdminOptions },
));
