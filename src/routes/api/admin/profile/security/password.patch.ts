import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';

import { kickAdminSessions } from '@/libs/admin/auth';

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
        await admin.assertUpdateSuccess({ password: data.newPassword });
        await kickAdminSessions(admin._id.toHexString());
        return ctx.createApiSuccessResponse();
    },
);
