import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import type { EmailProvider } from '@kcs-project/pack/models/email/provider';
import { createEmailProviderInputSchema } from '@kcs-project/pack/schemas/email';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';

export const jsonSchemaShape = {
    apiProxyUrl: z.blankToUndefined(z.url().trim()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(64),
    priority: z.int32(),
};

const jsonSchema = createEmailProviderInputSchema(jsonSchemaShape) satisfies ZodValidatorType<EmailProvider, 'cacheKey'>;

export default defineRoute({ permission: adminPermissions.email.provider.create })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        await EmailProviderModel.create({
            ...data,
            cacheKey: cryptoMd5(`${data.code}${data.apiProxyUrl}${JSON.stringify(data.config)}`),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
