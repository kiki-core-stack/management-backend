import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import type { QueryFilter } from 'mongoose';

import { kickAdminSessions } from '@/libs/admin/auth';
import { getAdminPermission } from '@/libs/admin/permission';

export const routePermission = 'admin admin.delete';

export default defineRouteHandlers(async (ctx) => {
    let adminId: string;

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
                await kickAdminSessions(adminId);
            },
        );
    });

    redisStore.adminPermission.removeItem(adminId!).catch(() => {});
    return ctx.createApiSuccessResponse();
});
