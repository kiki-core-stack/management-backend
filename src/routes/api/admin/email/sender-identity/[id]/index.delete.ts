import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

export const routePermission = 'admin email.senderIdentity.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(ctx, EmailSenderIdentityModel);
    return ctx.createApiSuccessResponse();
});
