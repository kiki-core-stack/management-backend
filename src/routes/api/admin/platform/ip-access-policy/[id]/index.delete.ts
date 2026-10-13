import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export const routePermission = 'admin platform.ipAccessPolicy.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(ctx, PlatformIpAccessPolicyModel);
    return ctx.createApiSuccessResponse();
});
