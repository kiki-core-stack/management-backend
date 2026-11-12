import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export default defineRoute({ permission: adminPermissions.sms.provider.toggle })(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, SmsProviderModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
