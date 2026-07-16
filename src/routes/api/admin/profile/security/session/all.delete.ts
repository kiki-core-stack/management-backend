import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    await adminAuthenticationSessionStore.revokeAll(ctx.adminId!.toHexString());
    adminAuthenticationSession.deleteCookie(ctx);
    return ctx.createApiSuccessResponse();
});
