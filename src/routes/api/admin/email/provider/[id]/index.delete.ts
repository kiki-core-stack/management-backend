import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import { EmailSendRecordModel } from '@kcs-project/pack/models/email/send-record';

export default defineRoute({ permission: adminPermissions.email.provider.delete })(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        EmailProviderModel,
        undefined,
        undefined,
        async (emailProvider) => {
            if (await EmailSendRecordModel.exists({ provider: emailProvider._id })) {
                throwApiError(apiErrors.common.conflict);
            }
        },
    );

    return ctx.createApiSuccessResponse();
});
