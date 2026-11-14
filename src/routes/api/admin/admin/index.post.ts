import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import { adminPasswordSchema } from '@kcs-project/pack/schemas/admin';
import type { ZodValidatorType } from '@kcs-project/pack/types';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(64),
    email: z.blankToUndefined(z.email().trim().toLowerCase()),
    enabled: z.boolean(),
    password: z.blankToUndefined(adminPasswordSchema),
    roles: z.array(commonZodSchemas.admin.existingRoleId),
}) satisfies ZodValidatorType<Admin, 'isSuperAdmin'>;

export default defineRoute({ permission: adminPermissions.admin.account.create })(
    apiValidator('json', jsonSchema.extend({ password: adminPasswordSchema })),
    async (ctx) => ctx.createApiSuccessResponse(await AdminModel.create(ctx.req.valid('json'))),
);
