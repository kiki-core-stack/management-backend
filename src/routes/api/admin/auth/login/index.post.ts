import {
    hashPasswordWithArgon2,
    verifyPasswordWithArgon2,
} from '@kiki-core-stack/pack/libs/password-argon2';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import type { AdminLoginFormData } from '@kiki-core-stack/pack/types/data/admin';

import { handleAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({
    account: z.string().trim().min(1),
    password: z.string().trim().min(1),
}) satisfies ZodValidatorType<AdminLoginFormData>;

const missingAdminPasswordHash = await hashPasswordWithArgon2('missing-admin');
export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        const admin = await AdminModel.findOne({
            account: data.account,
            enabled: true,
        });

        const passwordVerified = admin
            ? await admin.verifyPassword(data.password)
            : await verifyPasswordWithArgon2(missingAdminPasswordHash, data.password);

        if (!admin || !passwordVerified) throwApiError(404);
        await handleAdminLogin(ctx, admin);
        return ctx.createApiSuccessResponse();
    },
);
