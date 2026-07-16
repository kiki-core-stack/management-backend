import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const sessions = await adminAuthenticationSessionStore.list({
        currentSessionId: ctx.adminSessionId,
        principalId: ctx.adminId!.toHexString(),
    });

    return ctx.createApiSuccessResponse({
        count: sessions.length,
        list: sessions,
    });
});
