import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import { SmsSendRecordModel } from '@kcs-project/pack/models/sms/send-record';

export default defineRoute({ permission: adminPermissions.sms.provider.delete })(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        SmsProviderModel,
        undefined,
        undefined,
        async (smsProvider) => {
            if (await SmsSendRecordModel.exists({ provider: smsProvider._id })) {
                throwApiError(apiErrors.common.conflict);
            }
        },
    );

    return ctx.createApiSuccessResponse();
});
