import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';
import { adminPasswordSchema } from '@kcs-project/pack/schemas/admin';
import type { ZodValidatorType } from '@kcs-project/pack/types';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(64),
    email: z.blankToUndefined(z.email().trim().toLowerCase()),
    enabled: z.boolean(),
    password: z.blankToUndefined(adminPasswordSchema),
    roles: z.array(z.objectId().refine(
        (_id) => AdminRoleModel.exists({ _id }),
        z.i18nIssue({
            'en': 'The role does not exist',
            'zh-TW': '身分組不存在',
        }),
    )),
}) satisfies ZodValidatorType<Admin, 'isSuperAdmin'>;

export default defineRoute({ permission: adminPermissions.admin.account.create })(
    apiValidator('json', jsonSchema.extend({ password: adminPasswordSchema })),
    async (ctx) => ctx.createApiSuccessResponse(await AdminModel.create(ctx.req.valid('json'))),
);
