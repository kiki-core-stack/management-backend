import { AdminModel } from '@kcs-project/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kcs-project/pack/models/admin';
import { isEqual } from 'es-toolkit';
import type {
    QueryFilter,
    UpdateQuery,
} from 'mongoose';
import type { SetRequired } from 'type-fest';

import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';
import { getAdminPermission } from '@/libs/admin/permission';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin admin.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const filter: QueryFilter<Admin> = {};
        if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;

        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);

        // eslint-disable-next-line style/max-len
        const updateQuery: SetRequired<UpdateQuery<AdminDocument>, '$set'> = { $set: assertNotModifiedAndStripData(ctx.req.valid('json'), admin) };
        updateQuery.$set.enabled = updateQuery.$set.enabled || admin._id.equals(ctx.adminId);
        if (!updateQuery.$set.email) {
            delete updateQuery.$set.email;
            updateQuery.$unset = { email: true };
        }

        const adminId = admin._id.toHexString();
        const shouldRevokeAuthenticationSessions = !updateQuery.$set.enabled || updateQuery.$set.password !== undefined;
        if (shouldRevokeAuthenticationSessions) updateQuery.$inc = { authenticationRevision: 1 };

        await admin.assertUpdateSuccess(updateQuery);
        if (shouldRevokeAuthenticationSessions) {
            await adminAuthenticationSessionStore.revokeAll(adminId).catch(logger.error);
        }

        if (!isEqual(admin!.roles.toSorted(), updateQuery.$set.roles?.toSorted())) {
            await redisStore.admin.permission.removeItem(adminId);
        }

        return ctx.createApiSuccessResponse();
    },
);
