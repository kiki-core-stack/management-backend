import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import { EmailSendRecordModel } from '@kcs-project/pack/models/email/send-record';

export const routePermission = 'admin email.provider.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        EmailProviderModel,
        undefined,
        undefined,
        async (emailProvider) => {
            if (await EmailSendRecordModel.exists({ provider: emailProvider._id })) throwApiError(409);
        },
    );

    return ctx.createApiSuccessResponse();
});
