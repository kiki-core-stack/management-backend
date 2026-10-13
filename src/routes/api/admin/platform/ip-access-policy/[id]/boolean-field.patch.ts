import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export const routePermission = 'admin platform.ipAccessPolicy.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, PlatformIpAccessPolicyModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
