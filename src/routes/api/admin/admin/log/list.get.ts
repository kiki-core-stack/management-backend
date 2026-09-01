import { AdminLogModel } from '@kcs-project/pack/models/admin/log';

export const routePermission = 'admin admin.log.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        AdminLogModel,
        undefined,
        {
            options: { readPreference: 'secondaryPreferred' },
            populate: {
                path: 'admin',
                select: [
                    '-_id',
                    'account',
                ],
            },
        },
    );
});
