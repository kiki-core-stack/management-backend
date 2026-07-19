import { adminAuthenticationSession } from '@/constants/admin/authentication-session';
import { recordAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({ completionToken: z.string().trim().min(1) });
export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const completed = await adminAuthenticationSession.completeQrCodeLogin(
            ctx,
            {
                completionToken: ctx.req.valid('json').completionToken,
                ip: getClientIpFromXForwardedFor(ctx)!,
                userAgent: ctx.req.header('user-agent'),
            },
        );

        if (!completed) throwApiError(410);
        if (completed.state === 'completed') await recordAdminLogin(ctx, completed.session.principalId, 'QR Code 登入');
        return ctx.createApiSuccessResponse({ state: completed.state });
    },
);
