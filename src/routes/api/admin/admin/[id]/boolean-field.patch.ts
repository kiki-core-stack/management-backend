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

export default defineRoute({ permission: adminPermissions.admin.account.toggle })(async (ctx) => {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;

    const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);
    const { field, value } = await ctx.req.json<{ field: 'enabled'; value: boolean }>();
    switch (field) {
        case 'enabled': {
            if (!value && admin._id.equals(ctx.adminId)) throwApiError(apiErrors.common.badRequest);

            const updateQuery: SetRequired<UpdateQuery<AdminDocument>, '$set'> = { $set: { enabled: value } };
            if (!value) updateQuery.$inc = { authenticationRevision: 1 };

            await admin.assertUpdateSuccess(updateQuery);
            if (!value) await adminAuthenticationSessionStore.revokeAll(admin._id.toHexString()).catch(logger.error);
            break;
        }

        default: throwApiError(apiErrors.common.badRequest);
    }

    return ctx.createApiSuccessResponse();
});
