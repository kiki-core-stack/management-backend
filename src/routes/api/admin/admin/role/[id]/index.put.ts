import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';
import { isEqual } from 'es-toolkit';

import { clearAllAdminPermissionCache } from '@/libs/admin/permission';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin admin.role.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const adminRole = await AdminRoleModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), adminRole);
        await adminRole.assertUpdateSuccess({
            ...data,
            editedByAdmin: ctx.adminId,
        });

        if (!isEqual(adminRole.permissions.toSorted(), data.permissions.toSorted())) {
            clearAllAdminPermissionCache().catch(() => {});
        }

        return ctx.createApiSuccessResponse();
    },
);
