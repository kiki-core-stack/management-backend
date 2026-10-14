import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';
import type { PlatformIpAccessPolicy } from '@kcs-project/pack/models/platform/ip-access-policy';
import type { UpdateQuery } from 'mongoose';
import type { SetRequired } from 'type-fest';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin platform.ipAccessPolicy.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const platformIpAccessPolicy = await PlatformIpAccessPolicyModel.findByRouteIdOrThrowNotFoundError(ctx);
        const updateQuery: SetRequired<UpdateQuery<PlatformIpAccessPolicy>, '$set'> = {
            $set: {
                ...assertNotModifiedAndStripData(ctx.req.valid('json'), platformIpAccessPolicy),
                editedByAdmin: ctx.adminId,
            },
        };

        if (!updateQuery.$set.note) {
            delete updateQuery.$set.note;
            updateQuery.$unset = { note: true };
        }

        await platformIpAccessPolicy.assertUpdateSuccess(updateQuery);
        await clearPlatformIpAccessPolicyCache().catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
