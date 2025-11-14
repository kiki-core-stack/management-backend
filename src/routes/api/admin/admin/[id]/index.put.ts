import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import { isEqual } from 'es-toolkit';
import type {
    FilterQuery,
    UpdateQuery,
} from 'mongoose';

import { getAdminPermission } from '@/libs/admin/permission';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin admin.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        let admin: AdminDocument;

        const filter: FilterQuery<Admin> = {};
        if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;

        let updateQuery: UpdateQuery<AdminDocument> = {};
        await mongooseConnections.default!.transaction(async (session) => {
            admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter, undefined, { session });

            updateQuery = assertNotModifiedAndStripData(ctx.req.valid('json'), admin);
            updateQuery.enabled = updateQuery.enabled || admin._id.equals(ctx.adminId);
            if (!updateQuery.email) updateQuery.$unset = { email: true };
            await admin.assertUpdateSuccess(updateQuery, { session });

            if (!updateQuery.enabled) await AdminSessionModel.deleteMany({ admin }, { session });
        });

        if (!isEqual(admin!.roles.toSorted(), updateQuery.roles?.toSorted())) {
            redisStore.adminPermission.removeItem(admin!._id.toHexString()).catch(() => {});
        }

        return ctx.createApiSuccessResponse();
    },
);
