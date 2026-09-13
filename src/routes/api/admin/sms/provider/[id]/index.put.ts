import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import type { SmsProviderDocument } from '@kcs-project/pack/models/sms/provider';
import type { UpdateQuery } from 'mongoose';

import {
    jsonSchema,
    validateDataConfigField,
} from '../index.post';

export const routePermission = 'admin sms.provider.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const smsProvider = await SmsProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), smsProvider);
        data.code = smsProvider.code;
        validateDataConfigField(data);

        const updateQuery: UpdateQuery<SmsProviderDocument> = data;
        if (!updateQuery.apiProxyUrl) updateQuery.$unset = { apiProxyUrl: true };
        await smsProvider.assertUpdateSuccess({
            ...updateQuery,
            cacheKey: Bun.MD5.hash(`${data.code}${data.apiProxyUrl}${JSON.stringify(data.config)}`, 'hex'),
            editedByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
