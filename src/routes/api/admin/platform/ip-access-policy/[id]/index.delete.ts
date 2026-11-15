import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.delete })(async (ctx) => {
    await (await PlatformIpAccessPolicyModel.findByRouteIdOrThrowNotFoundError(ctx)).deleteOne();
    await clearPlatformIpAccessPolicyCache().catch(logger.error);
    return ctx.createApiSuccessResponse();
});
