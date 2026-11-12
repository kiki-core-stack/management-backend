import { adminAuthenticationSession } from '@/constants/admin/authentication-session';
import { recordAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({ completionToken: z.string().trim().min(1) });
export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const completed = await adminAuthenticationSession.completeQrCodeLogin(
            ctx,
            {
                completionToken: ctx.req.valid('json').completionToken,
                ip: getClientIp(ctx)!,
                userAgent: ctx.req.header('user-agent'),
            },
        );

        if (!completed) throwApiError(apiErrors.common.gone);
        if (completed.state === 'completed') await recordAdminLogin(ctx, completed.session.principalId, 'QR Code 登入');
        return ctx.createApiSuccessResponse({ state: completed.state });
    },
);
