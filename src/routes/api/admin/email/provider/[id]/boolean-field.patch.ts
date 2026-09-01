import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';

export const routePermission = 'admin email.provider.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, EmailProviderModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
