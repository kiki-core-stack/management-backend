import { revokeAllAuthSessions } from '@kcs-project/pack/libs/auth/session';

import { adminAuthRealm } from '@/constants/admin/auth';
import { findManageableAdminOrThrow } from '@/libs/admin/auth';

export default defineRoute({ permission: adminPermissions.admin.account.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const admin = await findManageableAdminOrThrow(ctx);
        const { enabled } = ctx.req.valid('json');
        if (!enabled && admin._id.equals(ctx.adminId)) {
            throwFieldValidationError(['enabled'], appLocaleCatalogs, (messages) => messages.validation.admin.cannotDisableSelf);
        }

        await admin.assertUpdateSuccess({ $set: { enabled } });
        if (!enabled) await revokeAllAuthSessions(adminAuthRealm, admin.id);
        return ctx.createApiSuccessResponse();
    },
);
