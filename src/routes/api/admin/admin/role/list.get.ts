import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

export const routePermission = 'admin admin.role.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        AdminRoleModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    );
});
