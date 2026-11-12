import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    const sessions = await adminAuthenticationSessionStore.list({
        currentSessionId: ctx.adminAuthenticationSession!.id,
        principalId: ctx.adminId!.toHexString(),
    });

    return ctx.createApiSuccessResponse({
        count: sessions.length,
        list: sessions,
    });
});
