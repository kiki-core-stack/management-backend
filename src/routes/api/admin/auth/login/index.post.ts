import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import type { AdminLoginFormData } from '@kiki-core-stack/pack/types/data/admin';

import { handleAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({
    account: z.string().trim().min(1),
    password: z.string().trim().min(1),
    verCode: z.string().trim().min(1).toLowerCase(),
}) satisfies ZodValidatorType<AdminLoginFormData>;

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        if (data.verCode !== ctx.popSession('verCode')?.toLowerCase()) throwApiError(400, 'invalidVerificationCode');
        const admin = await AdminModel.findOne({
            account: data.account,
            enabled: true,
        });

        if (!admin || !await admin?.verifyPassword(data.password)) throwApiError(404);
        await handleAdminLogin(ctx, admin._id);
        return ctx.createApiSuccessResponse();
    },
);
