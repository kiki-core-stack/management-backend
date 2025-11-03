import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { getAdminPermission } from '@/libs/admin/permission';

export const routePermission = 'admin admin.list';

export default defineRouteHandlers(async (ctx) => {
    const parsedQueryParams = parseApiRequestQueryParams(ctx);
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) parsedQueryParams.filter.isSuperAdmin = false;
    return paginateModelDataWithApiResponse(
        ctx,
        AdminModel,
        parsedQueryParams,
        {
            populate: {
                path: 'roles',
                select: ['name'],
            },
        },
    );
});
