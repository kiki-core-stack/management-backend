import { EmailServiceProvider } from '@kiki-core-stack/pack/constants/email';
import { EmailPlatformModel } from '@kiki-core-stack/pack/models/email/platform';
import type { EmailPlatform } from '@kiki-core-stack/pack/models/email/platform';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import type { EmailPlatformConfigs } from '@kiki-core-stack/pack/types/email';
import type {
    AnyRecord,
    ReadonlyRecord,
} from '@kikiutils/shared/types';
import type {
    output,
    ZodType,
} from 'zod';

const configValidators: ReadonlyRecord<EmailServiceProvider, ZodType<AnyRecord>> = {
    [EmailServiceProvider.Smtp]: z.object({
        host: z.hostname().trim(),
        password: z.string().min(1).optional(),
        port: z.int().min(1).max(65535),
        requireTls: z.boolean(),
        secure: z.boolean(),
        username: z.string().min(1).optional(),
    }) satisfies ZodValidatorType<EmailPlatformConfigs.Smtp>,
};

export const jsonSchema = z.object({
    config: z.object({}).catchall(z.any()),
    enabled: z.boolean(),
    name: z.string().trim().min(1).max(32),
    priority: z.int(),
    serviceProvider: z.enum(EmailServiceProvider),
}) satisfies ZodValidatorType<EmailPlatform, 'configMd5'>;

export const routePermission = 'admin email.platform.create';

export function validateDataConfigField(data: output<ZodValidatorType<EmailPlatform, 'configMd5'>>) {
    data.config = configValidators[data.serviceProvider].parse(data.config);
}

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        validateDataConfigField(data);
        await EmailPlatformModel.create({
            ...data,
            configMd5: Bun.MD5.hash(JSON.stringify(data.config), 'hex'),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
