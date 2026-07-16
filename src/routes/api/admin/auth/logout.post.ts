import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    ctx.clearSession();
    if (ctx.adminId && ctx.adminSessionId) await adminAuthenticationSessionStore.revoke(ctx.adminSessionId);
    adminAuthenticationSession.deleteCookie(ctx);
    return ctx.createApiSuccessResponse();
});
