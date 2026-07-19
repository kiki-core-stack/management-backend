import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const sessionId = ctx.req.param('id')!;
    if (sessionId === ctx.adminAuthenticationSession!.id) throwApiError(400);
    const sessions = await adminAuthenticationSessionStore.list({ principalId: ctx.adminId!.toHexString() });
    if (sessions.some((session) => session.id === sessionId)) await adminAuthenticationSessionStore.revoke(sessionId);
    return ctx.createApiSuccessResponse();
});
