import { revokeAllAuthSessions } from '@kcs-project/pack/libs/auth/session';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { Admin } from '@kcs-project/pack/models/admin';
import type { QueryFilter } from 'mongoose';

import { adminAuthRealm } from '@/constants/admin/auth';
import { getAdminPermission } from '@/libs/admin/permission';

export default defineRoute({ permission: adminPermissions.admin.account.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const filter: QueryFilter<Admin> = {};
        if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;

        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);
        const { enabled } = ctx.req.valid('json');
        if (!enabled && admin._id.equals(ctx.adminId)) {
            throwFieldValidationError(['enabled'], appLocaleCatalogs, (messages) => messages.validation.admin.cannotDisableSelf);
        }

        await admin.assertUpdateSuccess({ $set: { enabled } });
        if (!enabled) await revokeAllAuthSessions(adminAuthRealm, admin.id);
        return ctx.createApiSuccessResponse();
    },
);
