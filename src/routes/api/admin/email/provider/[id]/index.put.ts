import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import type { EmailProviderDocument } from '@kcs-project/pack/models/email/provider';
import { parseEmailProviderConfig } from '@kcs-project/pack/schemas/email';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';
import type { UpdateQuery } from 'mongoose';
import type { SetRequired } from 'type-fest';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin email.provider.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.omit({ code: true }).extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), emailProvider);
        const config = await parseEmailProviderConfig(emailProvider.code, data.config);

        const updateQuery: SetRequired<UpdateQuery<EmailProviderDocument>, '$set'> = {
            $set: {
                ...data,
                cacheKey: cryptoMd5(`${emailProvider.code}${data.apiProxyUrl}${JSON.stringify(config)}`),
                config,
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
