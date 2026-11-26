import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export default defineRoute({ permission: adminPermissions.sms.provider.delete })(async (ctx) => {
    const smsProvider = await SmsProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
    const { deletedCount } = await SmsProviderModel.deleteOne({
        _id: smsProvider._id,
        usedAt: { $exists: false },
    });

    if (!deletedCount) throwApiError(apiErrors.common.conflict);
    return ctx.createApiSuccessResponse();
});
