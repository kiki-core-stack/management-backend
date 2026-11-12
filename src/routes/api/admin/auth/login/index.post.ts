import {
    hashPasswordWithArgon2,
    verifyPasswordWithArgon2,
} from '@kcs-project/pack/libs/password-argon2';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import type { AdminLoginFormData } from '@kcs-project/pack/types/data/admin';

import { handleAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({
    account: z.string().trim().min(1),
    password: z.string().trim().min(1),
}) satisfies ZodValidatorType<AdminLoginFormData>;

const missingAdminPasswordHash = await hashPasswordWithArgon2('missing-admin');
export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        const admin = await AdminModel.findOne({
            account: data.account,
            enabled: true,
        });

        const passwordVerified = admin
            ? await admin.verifyPassword(data.password)
            : await verifyPasswordWithArgon2(missingAdminPasswordHash, data.password);

        if (!admin || !passwordVerified) throwApiError(apiErrors.common.notFound);
        await handleAdminLogin(ctx, admin);
        return ctx.createApiSuccessResponse();
    },
);
