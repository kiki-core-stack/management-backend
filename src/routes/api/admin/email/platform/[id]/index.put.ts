import { EmailPlatformModel } from '@kiki-core-stack/pack/models/email/platform';

import {
    jsonSchema,
    validateDataConfigField,
} from '../index.post';

export const routePermission = 'admin email.platform.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const emailPlatform = await EmailPlatformModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), emailPlatform);
        data.serviceProvider = emailPlatform.serviceProvider;
        validateDataConfigField(data);
        await emailPlatform.assertUpdateSuccess({
            ...data,
            configMd5: Bun.MD5.hash(JSON.stringify(data.config), 'hex'),
            editedByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
