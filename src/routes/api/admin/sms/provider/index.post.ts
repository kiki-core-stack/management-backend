import { SmsProviderCode } from '@kcs-project/pack/constants/sms';
import * as z from '@kcs-project/pack/libs/zod';
import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import type { SmsProvider } from '@kcs-project/pack/models/sms/provider';
import { parseSmsProviderConfig } from '@kcs-project/pack/schemas/sms';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import { cryptoMd5 } from '@kikiutils/shared/crypto-hash';
import type { SetFieldType } from 'type-fest';

type SmsProviderZodSchemaType = ZodValidatorType<SetFieldType<SmsProvider, 'config', Record<string, any>>, 'cacheKey'>;

export const jsonSchema = z.object({
    apiProxyUrl: z.url().trim().optional(),
    code: z.enum(SmsProviderCode),
    config: z.object({}).catchall(z.any()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(64),
    priority: z.int32(),
}) satisfies SmsProviderZodSchemaType;

export const routePermission = 'admin sms.provider.create';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        const config = await parseSmsProviderConfig(data.code, data.config);
        await SmsProviderModel.create({
            ...data,
            cacheKey: cryptoMd5(`${data.code}${data.apiProxyUrl}${JSON.stringify(config)}`),
            config,
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
