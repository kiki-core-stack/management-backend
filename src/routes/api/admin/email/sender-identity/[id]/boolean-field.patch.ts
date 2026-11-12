import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

export default defineRoute({ permission: adminPermissions.email.senderIdentity.toggle })(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, EmailSenderIdentityModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
