import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';

import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

const jsonSchema = z.object({
    newPassword: z.string().trim().min(1),
    oldPassword: z.string().trim().min(1),
}) satisfies ZodValidatorType<AdminChangePasswordData>;

export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const admin = await ctx.getAdmin();
        const data = ctx.req.valid('json');
        if (!await admin.verifyPassword(data.oldPassword)) throwApiError(400);
        await admin.assertUpdateSuccess({
            $inc: { authenticationRevision: 1 },
            password: data.newPassword,
        });

        await adminAuthenticationSessionStore.revokeAll(admin._id.toHexString()).catch(logger.error);
        adminAuthenticationSession.deleteCookie(ctx);
        return ctx.createApiSuccessResponse();
    },
);
