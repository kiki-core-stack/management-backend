import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

import { jsonSchema } from '../index.post';

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.update })(
    apiValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const platformIpAccessPolicy = await PlatformIpAccessPolicyModel.findByRouteIdOrThrowNotFoundError(ctx);
        await platformIpAccessPolicy.assertUpdateSuccess(buildUpdateQuery(
            {
                ...assertNotModifiedAndStripData(ctx.req.valid('json'), platformIpAccessPolicy),
                editedByAdmin: ctx.adminId,
            },
            ['note'],
        ));

        await clearPlatformIpAccessPolicyCache().catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
