import { AdminModel } from '@kcs-project/pack/models/admin';

import { getAdminPermission } from '@/libs/admin/permission';

export default defineRoute({ permission: adminPermissions.admin.account.list })(async (ctx) => {
    const isUnrestricted = (await getAdminPermission(ctx.adminId!)).unrestricted;
    return await paginateModelDataWithApiResponse(
        ctx,
        AdminModel,
        parseGetListQuery(ctx, AdminModel, { scope: isUnrestricted ? undefined : { isSuperAdmin: false } }),
        {
            populate: {
                path: 'roles',
                select: ['name'],
            },
        },
    );
});
