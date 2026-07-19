import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';

const jsonSchema = z.object({ approvalToken: z.string().trim().min(1) });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        if (
            !await adminAuthenticationSessionStore.qrCodeLogin.approve({
                approvalToken: ctx.req.valid('json').approvalToken,
                sourceSession: ctx.adminAuthenticationSession!,
            })
        ) throwApiError(410);

        return ctx.createApiSuccessResponse();
    },
);
