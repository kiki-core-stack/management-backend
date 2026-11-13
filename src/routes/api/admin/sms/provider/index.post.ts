import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import type { SmsProvider } from '@kcs-project/pack/models/sms/provider';
import { createSmsProviderInputSchema } from '@kcs-project/pack/schemas/sms';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';

export const jsonSchemaShape = {
    apiProxyUrl: z.blankToUndefined(z.url().trim()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(64),
    priority: z.int32(),
};

const jsonSchema = createSmsProviderInputSchema(jsonSchemaShape) satisfies ZodValidatorType<SmsProvider, 'cacheKey'>;

export default defineRoute({ permission: adminPermissions.sms.provider.create })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        await SmsProviderModel.create({
            ...data,
            cacheKey: cryptoMd5(`${data.code}${data.apiProxyUrl}${JSON.stringify(data.config)}`),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
