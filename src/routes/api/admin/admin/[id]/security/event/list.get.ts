import { AuthEventModel } from '@kcs-project/pack/models/auth/event';

import { adminAuthRealm } from '@/constants/admin/auth';
import { findManageableAdminOrThrow } from '@/libs/admin/auth';

export default defineRoute({ permission: adminPermissions.admin.account.manageSecurity })(async (ctx) => {
    // Always limited to the managed admin's events, whatever the request filters by.
    const query = parseGetListQuery(
        ctx,
        AuthEventModel,
        {
            scope: {
                principalId: (await findManageableAdminOrThrow(ctx)).id,
                realm: adminAuthRealm.name,
            },
        },
    );

    return await paginateModelDataWithApiResponse(ctx, AuthEventModel, query);
});
