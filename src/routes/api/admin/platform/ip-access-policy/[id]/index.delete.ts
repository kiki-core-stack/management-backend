import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.delete })(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(ctx, PlatformIpAccessPolicyModel);
    await clearPlatformIpAccessPolicyCache().catch(logger.error);
    return ctx.createApiSuccessResponse();
});
