import { AdminLogModel } from '@kcs-project/pack/models/admin/log';

export default defineRoute({ permission: adminPermissions.admin.log.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
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
    ),
);
