import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import { SmsSendRecordModel } from '@kcs-project/pack/models/sms/send-record';

export const routePermission = 'admin sms.provider.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        SmsProviderModel,
        undefined,
        undefined,
        async (smsProvider) => {
            if (await SmsSendRecordModel.exists({ provider: smsProvider._id })) throwApiError(409);
        },
    );

    return ctx.createApiSuccessResponse();
});
