import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export const routePermission = 'admin platform.ipAccessPolicy.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, PlatformIpAccessPolicyModel, ['enabled']);
    await clearPlatformIpAccessPolicyCache().catch(logger.error);
    return ctx.createApiSuccessResponse();
});
