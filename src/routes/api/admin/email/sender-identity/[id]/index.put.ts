import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

import { jsonSchema } from '../index.post';

export default defineRoute({ permission: adminPermissions.email.senderIdentity.update })(
    apiValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const emailSenderIdentity = await EmailSenderIdentityModel.findByRouteIdOrThrowNotFoundError(ctx);
        await emailSenderIdentity.assertUpdateSuccess({
            $set: {
                ...assertNotModifiedAndStripData(ctx.req.valid('json'), emailSenderIdentity),
                editedByAdmin: ctx.adminId,
            },
        });

        return ctx.createApiSuccessResponse();
    },
);
