import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kiki-core-stack/pack/models/admin';
import { isEqual } from 'es-toolkit';
import type {
    QueryFilter,
    UpdateQuery,
} from 'mongoose';

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

        const updateQuery: UpdateQuery<AdminDocument> = assertNotModifiedAndStripData(ctx.req.valid('json'), admin);
        updateQuery.enabled = updateQuery.enabled || admin._id.equals(ctx.adminId);
        if (!updateQuery.email) updateQuery.$unset = { email: true };

        const adminId = admin._id.toHexString();
        const shouldRevokeAuthenticationSessions = !updateQuery.enabled || updateQuery.password !== undefined;
        if (shouldRevokeAuthenticationSessions) updateQuery.$inc = { authenticationRevision: 1 };

        await admin.assertUpdateSuccess(updateQuery);
        if (shouldRevokeAuthenticationSessions) adminAuthenticationSessionStore.revokeAll(adminId).catch(logger.error);
        if (!isEqual(admin!.roles.toSorted(), updateQuery.roles?.toSorted())) {
            await redisStore.adminPermission.removeItem(adminId);
        }

        return ctx.createApiSuccessResponse();
    },
);
