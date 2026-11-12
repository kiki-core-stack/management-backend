import { AdminModel } from '@kcs-project/pack/models/admin';

import { getAdminPermission } from '@/libs/admin/permission';

export default defineRoute({ permission: adminPermissions.admin.list })(async (ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    if (!(await getAdminPermission(ctx.adminId!)).unrestricted) parsedApiRequestQueryParams.filter.isSuperAdmin = false;
    return await paginateModelDataWithApiResponse(
        ctx,
        AdminModel,
        parsedApiRequestQueryParams,
        {
            populate: {
                path: 'roles',
                select: ['name'],
            },
        },
    );
});
