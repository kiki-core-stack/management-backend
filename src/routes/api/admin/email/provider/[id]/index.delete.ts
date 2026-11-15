import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import { EmailSendRecordModel } from '@kcs-project/pack/models/email/send-record';

export default defineRoute({ permission: adminPermissions.email.provider.delete })(async (ctx) => {
    const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
    if (await EmailSendRecordModel.exists({ provider: emailProvider._id })) throwApiError(apiErrors.common.conflict);
    await emailProvider.deleteOne();
    return ctx.createApiSuccessResponse();
});
