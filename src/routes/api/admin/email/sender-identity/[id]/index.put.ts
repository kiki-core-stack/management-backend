import { EmailSenderIdentityModel } from '@kiki-core-stack/pack/models/email/sender-identity';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin email.senderIdentity.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const emailSenderIdentity = await EmailSenderIdentityModel.findByRouteIdOrThrowNotFoundError(ctx);
        await emailSenderIdentity.assertUpdateSuccess({
            ...assertNotModifiedAndStripData(ctx.req.valid('json'), emailSenderIdentity),
            editedByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
