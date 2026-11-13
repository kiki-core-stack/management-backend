import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export default defineRoute({ permission: adminPermissions.sms.provider.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const smsProvider = await SmsProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        await smsProvider.assertUpdateSuccess({
            $set: {
                ...ctx.req.valid('json'),
                editedByAdmin: ctx.adminId,
            },
        });

        return ctx.createApiSuccessResponse();
    },
);
