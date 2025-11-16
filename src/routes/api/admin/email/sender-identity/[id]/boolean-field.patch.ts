import { EmailSenderIdentityModel } from '@kiki-core-stack/pack/models/email/sender-identity';

export const routePermission = 'admin email.senderIdentity.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, EmailSenderIdentityModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
