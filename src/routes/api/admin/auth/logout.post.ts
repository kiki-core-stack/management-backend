import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    ctx.clearSession();
    if (ctx.adminAuthenticationSession) await adminAuthenticationSessionStore.revoke(ctx.adminAuthenticationSession.id);
    adminAuthenticationSession.deleteCookie(ctx);
    return ctx.createApiSuccessResponse();
});
