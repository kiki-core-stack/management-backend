import { kickAdminSessions } from '@/libs/admin/auth';
import { getAuthToken } from '@/libs/auth';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const adminSessionToken = await redisStore.adminSessionToken.getItem(ctx.req.param('id')!);
    if (adminSessionToken) {
        if (adminSessionToken === getAuthToken(ctx)) throwApiError(400);
        await kickAdminSessions(ctx.adminId!.toHexString(), adminSessionToken);
    }

    return ctx.createApiSuccessResponse();
});
