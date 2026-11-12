import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})(async (ctx) => {
    ctx.header('cache-control', 'no-store');

    const created = await adminAuthenticationSessionStore.qrCodeLogin.create({
        ip: getClientIp(ctx)!,
        userAgent: ctx.req.header('user-agent'),
    });

    return ctx.createApiSuccessResponse(created);
});
