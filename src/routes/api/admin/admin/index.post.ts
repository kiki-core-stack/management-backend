import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(32),
    email: z.email().trim().toLowerCase().optional(),
    enabled: z.boolean(),
    password: z.string().trim().min(1).optional(),
    roles: z.array(z.objectId().refine((_id) => AdminRoleModel.exists({ _id }))),
}) satisfies ZodValidatorType<Admin, 'isSuperAdmin'>;

export const routePermission = 'admin admin.create';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ password: z.string().trim().min(1) })),
    async (ctx) => ctx.createApiSuccessResponse(await AdminModel.create(ctx.req.valid('json'))),
);
