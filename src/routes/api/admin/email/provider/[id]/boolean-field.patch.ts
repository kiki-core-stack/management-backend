import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';

export default defineRoute({ permission: adminPermissions.email.provider.toggle })(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, EmailProviderModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
