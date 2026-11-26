import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';

export default defineRoute({ permission: adminPermissions.email.provider.delete })(async (ctx) => {
    const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
    const { deletedCount } = await EmailProviderModel.deleteOne({
        _id: emailProvider._id,
        usedAt: { $exists: false },
    });

    if (!deletedCount) throwApiError(apiErrors.common.conflict);
    return ctx.createApiSuccessResponse();
});
