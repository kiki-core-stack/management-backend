import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    const sessionId = ctx.req.param('id')!;
    if (sessionId === ctx.adminAuthenticationSession!.id) throwApiError(apiErrors.common.badRequest);
    const sessions = await adminAuthenticationSessionStore.list({ principalId: ctx.adminId!.toHexString() });
    if (sessions.some((session) => session.id === sessionId)) await adminAuthenticationSessionStore.revoke(sessionId);
    return ctx.createApiSuccessResponse();
});
