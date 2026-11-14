import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

import { clearAllAdminPermissionCache } from '@/libs/admin/permission';

import { jsonSchema } from '../index.post';

export default defineRoute({ permission: adminPermissions.admin.role.update })(
    apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
    async (ctx) => {
        const adminRole = await AdminRoleModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        await adminRole.assertUpdateIfNotModified(
            updatedAt,
            {
                $set: {
                    ...data,
                    editedByAdmin: ctx.adminId,
                },
            },
        );

        if (!isEqual(adminRole.permissions.toSorted(), data.permissions.toSorted())) {
            await clearAllAdminPermissionCache().catch(logger.error);
        }

        return ctx.createApiSuccessResponse();
    },
);
