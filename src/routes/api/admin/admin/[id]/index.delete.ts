import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import type { FilterQuery } from 'mongoose';

import { getAdminPermission } from '@/libs/admin/permission';

export const routePermission = 'admin admin.delete';

export default defineRouteHandlers(async (ctx) => {
    let admin: AdminDocument | undefined;
    const filter: FilterQuery<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;
    await mongooseConnections.default!.transaction(async (session) => {
        admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter, undefined, { session });
        if (admin._id.equals(ctx.adminId)) throwApiError(409);
        if (await AdminModel.countDocuments(undefined, { session }) === 1) throwApiError(409);
        await AdminSessionModel.deleteMany({ admin }, { session });
        await admin.deleteOne({ session });
    });

    if (admin) redisStore.adminPermission.removeItem(admin._id.toHexString()).catch(() => {});
    return ctx.createApiSuccessResponse();
});
