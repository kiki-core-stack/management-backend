import { expandPermissionRequirements } from '@kcs-project/pack/libs/permission';
import type { AdminRole } from '@kcs-project/pack/models/admin/role';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';
import type { ZodValidatorType } from '@kcs-project/pack/types';

import { adminPermissionCatalog } from '@/constants/permissions/admin';

export const jsonSchema = z.object({
    name: z.string().trim().min(1).max(64),
    // Stored with the permissions they require, so a role never has unusable permissions.
    permissions: z
        .array(z.enum(adminPermissionCatalog.keys))
        .transform((keys) => expandPermissionRequirements(adminPermissionCatalog.requirements, keys).toSorted()),
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
