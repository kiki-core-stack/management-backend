import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';

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
        return await mongooseConnections.default!.transaction(async (session) => {
            await admin.assertUpdateSuccess({ password: data.newPassword }, { session });
            await AdminSessionModel.deleteMany({ admin }, { session });
            return ctx.createApiSuccessResponse();
        });
    },
);
