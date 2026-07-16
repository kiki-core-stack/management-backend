import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import type { QueryFilter } from 'mongoose';

import { adminAuthenticationSessionStore } from '@/constants/admin/authentication-session';
import { getAdminPermission } from '@/libs/admin/permission';

export const routePermission = 'admin admin.delete';

export default defineRouteHandlers(async (ctx) => {
    let adminId: string | undefined;

    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;

    await mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndDelete(
            ctx,
            AdminModel,
            filter,
            { session },
            async (admin) => {
                if (admin._id.equals(ctx.adminId)) throwApiError(409);
                if (await AdminModel.countDocuments(undefined, { session }) === 1) throwApiError(409);
                adminId = admin._id.toHexString();
                await adminAuthenticationSessionStore.revokeAll(adminId);
            },
        );
    });

    redisStore.adminPermission.removeItem(adminId!).catch(() => {});
    return ctx.createApiSuccessResponse();
});
