import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export const routePermission = 'admin sms.provider.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, SmsProviderModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
