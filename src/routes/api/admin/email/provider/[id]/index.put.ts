import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import { createEmailProviderInputSchema } from '@kcs-project/pack/schemas/email';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';

import { jsonSchemaShape } from '../index.post';

export default defineRoute({ permission: adminPermissions.email.provider.update })(
    apiValidator(
        'json',
        createEmailProviderInputSchema({
            ...jsonSchemaShape,
            ...notModifiedInputShape,
        }),
    ),
    async (ctx) => {
        const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        if (data.code !== emailProvider.code) {
            throwFieldValidationError(
                ctx,
                ['code'],
                {
                    'en': 'The provider cannot be changed',
                    'zh-TW': '不能變更服務商',
                },
            );
        }

        await emailProvider.assertUpdateIfNotModified(
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
