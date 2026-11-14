import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import { createSmsProviderInputSchema } from '@kcs-project/pack/schemas/sms';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';

import { jsonSchemaShape } from '../index.post';

export default defineRoute({ permission: adminPermissions.sms.provider.update })(
    apiValidator(
        'json',
        createSmsProviderInputSchema({
            ...jsonSchemaShape,
            ...notModifiedInputShape,
        }),
    ),
    async (ctx) => {
        const smsProvider = await SmsProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        if (data.code !== smsProvider.code) {
            throwFieldValidationError(
                ctx,
                ['code'],
                {
                    'en': 'The provider cannot be changed',
                    'zh-TW': '不能變更服務商',
                },
            );
        }

        await smsProvider.assertUpdateIfNotModified(
            updatedAt,
            buildUpdateQuery(
                {
                    ...data,
                    cacheKey: cryptoMd5(`${data.code}${data.apiProxyUrl}${JSON.stringify(data.config)}`),
                    editedByAdmin: ctx.adminId,
                },
                ['apiProxyUrl'],
            ),
        );

        return ctx.createApiSuccessResponse();
    },
);
