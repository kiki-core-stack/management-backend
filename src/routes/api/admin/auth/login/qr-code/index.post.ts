import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    ctx.header('cache-control', 'no-store');

    const created = await adminAuthenticationSessionStore.qrCodeLogin.create({
        ip: getClientIpFromXForwardedFor(ctx)!,
        userAgent: ctx.req.header('user-agent'),
    });

    return ctx.createApiSuccessResponse(created);
});
