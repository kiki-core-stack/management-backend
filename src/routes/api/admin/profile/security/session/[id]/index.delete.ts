import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

import { getAuthToken } from '@/libs/auth';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const adminSession = await AdminSessionModel.findByRouteIdOrThrowNotFoundError(ctx, { admin: ctx.adminId });
    if (adminSession.token === getAuthToken(ctx)) throwApiError(400);
    await adminSession.deleteOne();
    return ctx.createApiSuccessResponse();
});
