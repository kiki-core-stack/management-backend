import type { AdminRole } from '@kcs-project/pack/models/admin/role';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';
import type { ZodValidatorType } from '@kcs-project/pack/types';

import { adminPermissionCatalog } from '@/constants/permissions/admin';

export const jsonSchema = z.object({
    name: z.string().trim().min(1).max(64),
    permissions: z.array(z.enum(adminPermissionCatalog.keys)),
}) satisfies ZodValidatorType<AdminRole>;

export default defineRoute({ permission: adminPermissions.admin.role.create })(
    apiValidator('json', jsonSchema),
    async (ctx) => ctx.createApiSuccessResponse(
        await AdminRoleModel.create({
            ...ctx.req.valid('json'),
            createdByAdmin: ctx.adminId,
        }),
    ),
);
