import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import { SmsSendRecordModel } from '@kcs-project/pack/models/sms/send-record';

export default defineRoute({ permission: adminPermissions.sms.provider.delete })(async (ctx) => {
    const smsProvider = await SmsProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
    if (await SmsSendRecordModel.exists({ provider: smsProvider._id })) throwApiError(apiErrors.common.conflict);
    await smsProvider.deleteOne();
    return ctx.createApiSuccessResponse();
});
