import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import { createEmailProviderInputSchema } from '@kcs-project/pack/schemas/email';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';

import { jsonSchemaShape } from '../index.post';

export default defineRoute({ permission: adminPermissions.email.provider.update })(
    apiValidator(
        'json',
        createEmailProviderInputSchema({
            ...jsonSchemaShape,
            updatedAt: z.strictIsoDateString(),
        }),
    ),
    async (ctx) => {
        const emailProvider = await EmailProviderModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), emailProvider);
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

        await emailProvider.assertUpdateSuccess(buildUpdateQuery(
            {
                ...data,
                cacheKey: cryptoMd5(`${data.code}${data.apiProxyUrl}${JSON.stringify(data.config)}`),
                editedByAdmin: ctx.adminId,
            },
            ['apiProxyUrl'],
        ));

        return ctx.createApiSuccessResponse();
    },
);
