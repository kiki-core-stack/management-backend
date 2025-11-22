import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { QueryFilter } from 'mongoose';

import { getAdminPermission } from '@/libs/admin/permission';

export const routePermission = 'admin admin.toggle';

export default defineRouteHandlers(async (ctx) => {
    const filter: QueryFilter<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;

    return mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndUpdateBooleanField(
            ctx,
            AdminModel,
            ['enabled'],
            filter,
            { session },
            async (admin, field, value) => {
                if (field === 'enabled' && !value) {
                    if (admin._id.equals(ctx.adminId)) throwApiError(400);
                    await AdminSessionModel.deleteMany({ admin }, { session });
                }
            },
        );

        return ctx.createApiSuccessResponse();
    });
});
