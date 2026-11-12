import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})(async (ctx) => {
    if (ctx.adminAuthenticationSession) await adminAuthenticationSessionStore.revoke(ctx.adminAuthenticationSession.id);
    adminAuthenticationSession.deleteCookie(ctx);
    return ctx.createApiSuccessResponse();
});
