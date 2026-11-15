import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

export default defineRoute({ permission: adminPermissions.email.senderIdentity.delete })(async (ctx) => {
    await (await EmailSenderIdentityModel.findByRouteIdOrThrowNotFoundError(ctx)).deleteOne();
    return ctx.createApiSuccessResponse();
});
