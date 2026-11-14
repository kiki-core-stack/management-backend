import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

import { jsonSchema } from '../index.post';

export default defineRoute({ permission: adminPermissions.email.senderIdentity.update })(
    apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
    async (ctx) => {
        const emailSenderIdentity = await EmailSenderIdentityModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        await emailSenderIdentity.assertUpdateIfNotModified(
            updatedAt,
            {
                $set: {
                    ...data,
                    editedByAdmin: ctx.adminId,
                },
            },
        );

        return ctx.createApiSuccessResponse();
    },
);
