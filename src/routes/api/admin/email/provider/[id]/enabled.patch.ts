import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';

export default defineRoute({ permission: adminPermissions.email.provider.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        await emailProvider.assertUpdateSuccess({
            $set: {
                ...ctx.req.valid('json'),
                editedByAdmin: ctx.adminId,
            },
        });

        return ctx.createApiSuccessResponse();
    },
);
