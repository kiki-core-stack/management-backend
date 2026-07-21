import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kiki-core-stack/pack/models/admin';
import type {
    QueryFilter,
    UpdateQuery,
} from 'mongoose';

import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';
import { getAdminPermission } from '@/libs/admin/permission';

export const routePermission = 'admin admin.toggle';

export default defineRouteHandlers(async (ctx) => {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;

    const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter);
    const { field, value } = await ctx.req.json<{ field: 'enabled'; value: boolean }>();
    switch (field) {
        case 'enabled': {
            if (!value && admin._id.equals(ctx.adminId)) throwApiError(400);

            const updateQuery: UpdateQuery<AdminDocument> = { enabled: value };
            if (!value) updateQuery.$inc = { authenticationRevision: 1 };

            await admin.assertUpdateSuccess(updateQuery);
            if (!value) await adminAuthenticationSessionStore.revokeAll(admin._id.toHexString()).catch(logger.error);
            break;
        }

        default: throwApiError(400);
    }

    return ctx.createApiSuccessResponse();
});
