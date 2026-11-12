import { EmailProviderCode } from '@kcs-project/pack/constants/email';
import * as z from '@kcs-project/pack/libs/zod';
import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import type { EmailProvider } from '@kcs-project/pack/models/email/provider';
import { parseEmailProviderConfig } from '@kcs-project/pack/schemas/email';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';
import type { SetFieldType } from 'type-fest';

type EmailProviderZodSchemaType = ZodValidatorType<
    SetFieldType<EmailProvider, 'config', Record<string, any>>,
    'cacheKey'
>;

export const jsonSchema = z.object({
    apiProxyUrl: z.url().trim().optional(),
    code: z.enum(EmailProviderCode),
    config: z.object({}).catchall(z.any()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(64),
    priority: z.int32(),
}) satisfies EmailProviderZodSchemaType;

export default defineRoute({ permission: adminPermissions.email.provider.create })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        const config = await parseEmailProviderConfig(data.code, data.config);
        await EmailProviderModel.create({
            ...data,
            cacheKey: cryptoMd5(`${data.code}${data.apiProxyUrl}${JSON.stringify(config)}`),
            config,
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
