import { SmsProviderCode } from '@kcs-project/pack/constants/sms';
import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';
import type { SmsProvider } from '@kcs-project/pack/models/sms/provider';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import type { SmsProviderConfigs } from '@kcs-project/pack/types/sms';
import type {
    AnyRecord,
    ReadonlyRecord,
} from '@kikiutils/shared/types';
import type {
    output,
    ZodType,
} from 'zod';

const configValidators: ReadonlyRecord<SmsProviderCode, ZodType<AnyRecord>> = {
    [SmsProviderCode.Mitake]: z.object({
        apiUrl: z.url().trim(),
        password: z.string().trim().min(1).regex(/^[a-z0-9]+$/i),
        username: z.string().trim().min(1).regex(/^[a-z0-9]+$/i),
    }) satisfies ZodValidatorType<SmsProviderConfigs.Mitake>,
    [SmsProviderCode.TwSms]: z.object({
        apiUrl: z.url().trim(),
        password: z.string().trim().min(1).regex(/^[a-z0-9]+$/i),
        username: z.string().trim().min(1).regex(/^[a-z0-9]+$/i),
    }) satisfies ZodValidatorType<SmsProviderConfigs.TwSms>,
};

export const jsonSchema = z.object({
    apiProxyUrl: z.url().trim().optional(),
    code: z.enum(SmsProviderCode),
    config: z.object({}).catchall(z.any()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(64),
    priority: z.int(),
}) satisfies ZodValidatorType<SmsProvider, 'configHash'>;

export const routePermission = 'admin sms.provider.create';

export function validateDataConfigField(data: output<ZodValidatorType<SmsProvider, 'configHash'>>) {
    data.config = configValidators[data.code].parse(data.config);
}

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        validateDataConfigField(data);
        await SmsProviderModel.create({
            ...data,
            configHash: Bun.MD5.hash(JSON.stringify(data.config), 'hex'),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
