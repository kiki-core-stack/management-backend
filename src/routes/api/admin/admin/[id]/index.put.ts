import { AuthEventType } from '@kcs-project/pack/constants/auth';
import { recordAuthEvent } from '@kcs-project/pack/libs/auth/event';
import { revokeAllAuthSessionsAround } from '@kcs-project/pack/libs/auth/session';
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

import { adminAuthRealm } from '@/constants/admin/auth';
import {
    clearAdminPermissionCache,
    getAdminPermission,
} from '@/libs/admin/permission';

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
        const update = async () => await admin.assertUpdateIfNotModified(updatedAt, updateQuery);
        // Disabling the account or changing its password revokes all of its sessions, before and after the write.
        if (!updateQuery.$set.enabled || updateQuery.$set.password !== undefined) {
            await revokeAllAuthSessionsAround(adminAuthRealm, adminId, update);
        } else await update();

        if (updateQuery.$set.password !== undefined) {
            await recordAuthEvent(
                adminAuthRealm,
                {
                    actor: {
                        principalId: ctx.adminId!.toHexString(),
                        realm: adminAuthRealm.name,
                    },
                    principalId: adminId,
                    request: {
                        ip: getClientIp(ctx),
                        userAgent: ctx.req.header('user-agent'),
                    },
                    sessionId: ctx.authSession?.id,
                    type: AuthEventType.PasswordChanged,
                },
            );
        }

        if (!isEqual(admin.roles.toSorted(), updateQuery.$set.roles?.toSorted())) {
            await clearAdminPermissionCache(adminId).catch(logger.error);
        }

        return ctx.createApiSuccessResponse();
    },
);
