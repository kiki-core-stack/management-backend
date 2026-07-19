import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

const jsonSchema = z.object({ approvalToken: z.string().trim().min(1) });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const request = await adminAuthenticationSessionStore.qrCodeLogin.getApprovalRequest(
            ctx.req.valid('json').approvalToken,
        );

        if (!request) throwApiError(410);
        return ctx.createApiSuccessResponse(request);
    },
);
