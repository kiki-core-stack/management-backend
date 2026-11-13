import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

export default defineRoute({ permission: adminPermissions.email.senderIdentity.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const emailSenderIdentity = await EmailSenderIdentityModel.findByRouteIdOrThrowNotFoundError(ctx);
        await emailSenderIdentity.assertUpdateSuccess({
            $set: {
                ...ctx.req.valid('json'),
                editedByAdmin: ctx.adminId,
            },
        });

        return ctx.createApiSuccessResponse();
    },
);
