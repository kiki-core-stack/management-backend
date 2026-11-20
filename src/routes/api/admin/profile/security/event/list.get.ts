import { AuthEventModel } from '@kcs-project/pack/models/auth/event';

import { adminAuthRealm } from '@/constants/admin/auth';

export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    // Always limited to the admin's own events, whatever the request filters by.
    const query = parseGetListQuery(
        ctx,
        AuthEventModel,
        {
            scope: {
                principalId: ctx.adminId!,
                realm: adminAuthRealm.name,
            },
        },
    );

    return await paginateModelDataWithApiResponse(ctx, AuthEventModel, query);
});
