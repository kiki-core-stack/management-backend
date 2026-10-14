import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export const routePermission = 'admin platform.ipAccessPolicy.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(ctx, PlatformIpAccessPolicyModel);
    await clearPlatformIpAccessPolicyCache().catch(logger.error);
    return ctx.createApiSuccessResponse();
});
