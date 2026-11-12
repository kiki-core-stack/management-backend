import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

const jsonSchema = z.object({ approvalToken: z.string().trim().min(1) });
export default defineRoute({ permission: 'ignore' })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const request = await adminAuthenticationSessionStore.qrCodeLogin.getApprovalRequest(
            ctx.req.valid('json').approvalToken,
        );

        if (!request) throwApiError(apiErrors.common.gone);
        return ctx.createApiSuccessResponse(request);
    },
);
