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

export default defineRoute({ permission: adminPermissions.admin.account.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const filter: QueryFilter<Admin> = {};
        if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;

        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);
        const { enabled } = ctx.req.valid('json');
        if (!enabled && admin._id.equals(ctx.adminId)) {
            throwFieldValidationError(
                ctx,
                ['enabled'],
                {
                    'en': 'You cannot disable your own account',
                    'zh-TW': '不能停用自己的帳號',
                },
            );
        }

        const updateQuery: SetRequired<UpdateQuery<AdminDocument>, '$set'> = { $set: { enabled } };
        if (!enabled) updateQuery.$inc = { authenticationRevision: 1 };

        await admin.assertUpdateSuccess(updateQuery);
        if (!enabled) await adminAuthenticationSessionStore.revokeAll(admin._id.toHexString()).catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
