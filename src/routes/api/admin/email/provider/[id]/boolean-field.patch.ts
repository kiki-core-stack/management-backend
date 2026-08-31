import { EmailProviderModel } from '@kiki-core-stack/pack/models/email/provider';

export const routePermission = 'admin email.provider.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, EmailProviderModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
