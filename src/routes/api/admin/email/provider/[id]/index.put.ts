import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import type { EmailProviderDocument } from '@kcs-project/pack/models/email/provider';
import type { UpdateQuery } from 'mongoose';
import type { SetRequired } from 'type-fest';

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
        data.code = emailProvider.code;
        validateDataConfigField(data);

        const updateQuery: SetRequired<UpdateQuery<EmailProviderDocument>, '$set'> = {
            $set: {
                ...data,
                cacheKey: Bun.MD5.hash(`${data.code}${data.apiProxyUrl}${JSON.stringify(data.config)}`, 'hex'),
                editedByAdmin: ctx.adminId,
            },
        };

        if (!updateQuery.$set.apiProxyUrl) {
            delete updateQuery.$set.apiProxyUrl;
            updateQuery.$unset = { apiProxyUrl: true };
        }

        await emailProvider.assertUpdateSuccess(updateQuery);
        return ctx.createApiSuccessResponse();
    },
);
