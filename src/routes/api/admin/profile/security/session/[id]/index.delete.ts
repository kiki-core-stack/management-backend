import { kickAdminSessions } from '@/libs/admin/auth';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const adminSessionToken = await redisStore.adminSessionToken.getItem(ctx.req.param('id')!);
    if (adminSessionToken) {
        const adminSession = await redisStore.adminSession.getItem(adminSessionToken);
        const adminId = ctx.adminId!.toHexString();
        if (adminSession?.adminId === adminId) {
            if (adminSession.id === ctx.adminSessionId!.toHexString()) throwApiError(400);
            await kickAdminSessions(adminId, adminSessionToken);
        }
    }

    return ctx.createApiSuccessResponse();
});
