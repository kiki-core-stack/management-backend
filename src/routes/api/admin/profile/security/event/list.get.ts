import { AuthEventModel } from '@kcs-project/pack/models/auth/event';

import { adminAuthRealm } from '@/constants/admin/auth';

export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    // Always limited to the admin's own events, whatever the request filters by.
    parsedApiRequestQueryParams.filter.principalId = ctx.adminId!;
    parsedApiRequestQueryParams.filter.realm = adminAuthRealm.name;
    return await paginateModelDataWithApiResponse(ctx, AuthEventModel, parsedApiRequestQueryParams);
});
