import { EmailProviderCode } from '@kcs-project/pack/constants/email';
import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';
import type { EmailProvider } from '@kcs-project/pack/models/email/provider';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import type { EmailProviderConfigs } from '@kcs-project/pack/types/email';
import type {
    AnyRecord,
    ReadonlyRecord,
} from '@kikiutils/shared/types';
import type {
    output,
    ZodType,
} from 'zod';

const configValidators: ReadonlyRecord<EmailProviderCode, ZodType<AnyRecord>> = {
    [EmailProviderCode.Smtp]: z.object({
        host: z.hostname().trim(),
        password: z.string().min(1).optional(),
        port: z.int().min(1).max(65535),
        secure: z.boolean(),
        tls: z.object({
            rejectUnauthorized: z.boolean(),
            required: z.boolean(),
        }),
        username: z.string().min(1).optional(),
    }) satisfies ZodValidatorType<EmailProviderConfigs.Smtp>,
};

export const jsonSchema = z.object({
    apiProxyUrl: z.url().trim().optional(),
    config: z.object({}).catchall(z.any()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(64),
    priority: z.int(),
    providerCode: z.enum(EmailProviderCode),
}) satisfies ZodValidatorType<EmailProvider, 'configHash'>;

export const routePermission = 'admin email.provider.create';

export function validateDataConfigField(data: output<ZodValidatorType<EmailProvider, 'configHash'>>) {
    data.config = configValidators[data.providerCode].parse(data.config);
}

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        validateDataConfigField(data);
        await EmailProviderModel.create({
            ...data,
            configHash: Bun.MD5.hash(JSON.stringify(data.config), 'hex'),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
