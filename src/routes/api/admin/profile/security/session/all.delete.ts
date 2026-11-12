import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    await adminAuthenticationSessionStore.revokeAll(ctx.adminId!.toHexString());
    adminAuthenticationSession.deleteCookie(ctx);
    return ctx.createApiSuccessResponse();
});
