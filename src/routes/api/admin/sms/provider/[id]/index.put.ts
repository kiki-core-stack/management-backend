import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import type { SmsProviderDocument } from '@kcs-project/pack/models/sms/provider';
import { parseSmsProviderConfig } from '@kcs-project/pack/schemas/sms';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';
import type { UpdateQuery } from 'mongoose';
import type { SetRequired } from 'type-fest';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin sms.provider.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.omit({ code: true }).extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const smsProvider = await SmsProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), smsProvider);
        const config = await parseSmsProviderConfig(smsProvider.code, data.config);

        const updateQuery: SetRequired<UpdateQuery<SmsProviderDocument>, '$set'> = {
            $set: {
                ...data,
                cacheKey: cryptoMd5(`${smsProvider.code}${data.apiProxyUrl}${JSON.stringify(config)}`),
                config,
                editedByAdmin: ctx.adminId,
            },
        };

        if (!updateQuery.$set.apiProxyUrl) {
            delete updateQuery.$set.apiProxyUrl;
            updateQuery.$unset = { apiProxyUrl: true };
        }

        await smsProvider.assertUpdateSuccess(updateQuery);
        return ctx.createApiSuccessResponse();
    },
);
