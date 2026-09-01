import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import type { EmailProviderDocument } from '@kcs-project/pack/models/email/provider';
import type { UpdateQuery } from 'mongoose';

import {
    jsonSchema,
    validateDataConfigField,
} from '../index.post';

export const routePermission = 'admin email.provider.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), emailProvider);
        data.providerCode = emailProvider.providerCode;
        validateDataConfigField(data);

        const updateQuery: UpdateQuery<EmailProviderDocument> = data;
        if (!updateQuery.apiProxyUrl) updateQuery.$unset = { apiProxyUrl: true };
        await emailProvider.assertUpdateSuccess({
            ...updateQuery,
            configHash: Bun.MD5.hash(JSON.stringify(data.config), 'hex'),
            editedByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
