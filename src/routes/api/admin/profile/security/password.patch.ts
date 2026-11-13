import { adminPasswordSchema } from '@kcs-project/pack/schemas/admin';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import type { AdminChangePasswordData } from '@kcs-project/pack/types/data/admin';

import {
    adminAuthenticationSession,
    adminAuthenticationSessionStore,
} from '@/constants/admin/authentication-session';

const jsonSchema = z.object({
    newPassword: adminPasswordSchema,
    oldPassword: z.string().min(1),
}) satisfies ZodValidatorType<AdminChangePasswordData>;

export default defineRoute({ permission: 'ignore' })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const admin = await ctx.getAdmin();
        const data = ctx.req.valid('json');
        if (!await admin.verifyPassword(data.oldPassword)) {
            throwFieldValidationError(
                ctx,
                ['oldPassword'],
                {
                    'en': 'Incorrect password',
                    'zh-TW': '密碼錯誤',
                },
            );
        }

        await admin.assertUpdateSuccess({
            $inc: { authenticationRevision: 1 },
            $set: { password: data.newPassword },
        });

        await adminAuthenticationSessionStore.revokeAll(admin._id.toHexString()).catch(logger.error);
        adminAuthenticationSession.deleteCookie(ctx);
        return ctx.createApiSuccessResponse();
    },
);
