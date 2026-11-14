import { AdminModel } from '@kcs-project/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kcs-project/pack/models/admin';
import type {
    QueryFilter,
    UpdateQuery,
} from 'mongoose';
import type { SetRequired } from 'type-fest';

import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';
import { getAdminPermission } from '@/libs/admin/permission';

import { jsonSchema } from '../index.post';

export default defineRoute({ permission: adminPermissions.admin.account.update })(
    apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
    async (ctx) => {
        const filter: QueryFilter<Admin> = {};
        if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;

        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);

        const { updatedAt, ...data } = ctx.req.valid('json');
        const updateQuery: SetRequired<UpdateQuery<AdminDocument>, '$set'> = buildUpdateQuery(data, ['email']);

        updateQuery.$set.enabled = updateQuery.$set.enabled || admin._id.equals(ctx.adminId);

        const adminId = admin._id.toHexString();
        const shouldRevokeAuthenticationSessions = !updateQuery.$set.enabled || updateQuery.$set.password !== undefined;
        if (shouldRevokeAuthenticationSessions) updateQuery.$inc = { authenticationRevision: 1 };

        await admin.assertUpdateIfNotModified(updatedAt, updateQuery);
        if (shouldRevokeAuthenticationSessions) {
            await adminAuthenticationSessionStore.revokeAll(adminId).catch(logger.error);
        }

        if (!isEqual(admin.roles.toSorted(), updateQuery.$set.roles?.toSorted())) {
            await redisStore.admin.permission.removeItem(adminId).catch(logger.error);
        }

        return ctx.createApiSuccessResponse();
    },
);
