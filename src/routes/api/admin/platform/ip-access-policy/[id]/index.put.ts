import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

import { jsonSchema } from '../index.post';

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.update })(
    apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
    async (ctx) => {
        const platformIpAccessPolicy = await PlatformIpAccessPolicyModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        await platformIpAccessPolicy.assertUpdateIfNotModified(
            updatedAt,
            buildUpdateQuery(
                {
                    ...data,
                    editedByAdmin: ctx.adminId,
                },
                ['note'],
            ),
        );

        await clearPlatformIpAccessPolicyCache().catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
