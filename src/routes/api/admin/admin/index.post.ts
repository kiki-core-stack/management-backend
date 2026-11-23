import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';
import { strongPasswordSchema } from '@kcs-project/pack/schemas/password';
import type { ZodValidatorType } from '@kcs-project/pack/types';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(64),
    email: z.blankToUndefined(z.email().trim().toLowerCase()),
    enabled: z.boolean(),
    password: z.blankToUndefined(strongPasswordSchema),
    roles: z.array(
        z.objectId().refine(
            async (_id) => !!await AdminRoleModel.exists({ _id }),
            z.i18nIssue(appLocaleCatalogs, (messages) => messages.validation.admin.roleNotFound),
        ),
    ),
}) satisfies ZodValidatorType<Admin, 'isSuperAdmin'>;

export default defineRoute({ permission: adminPermissions.admin.account.create })(
    apiValidator('json', jsonSchema.extend({ password: strongPasswordSchema })),
    async (ctx) => ctx.createApiSuccessResponse(await AdminModel.create(ctx.req.valid('json'))),
);
