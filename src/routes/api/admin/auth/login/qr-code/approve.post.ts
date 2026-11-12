import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

const jsonSchema = z.object({ approvalToken: z.string().trim().min(1) });
export default defineRoute({ permission: 'ignore' })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        if (
            !await adminAuthenticationSessionStore.qrCodeLogin.approve({
                approvalToken: ctx.req.valid('json').approvalToken,
                sourceSession: ctx.adminAuthenticationSession!,
            })
        ) throwApiError(apiErrors.common.gone);

        return ctx.createApiSuccessResponse();
    },
);
