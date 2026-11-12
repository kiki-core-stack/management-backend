import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

export default defineRoute({ permission: adminPermissions.admin.role.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        AdminRoleModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    ),
);
