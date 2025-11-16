import { EmailSenderIdentityKey } from '@kiki-core-stack/pack/constants/email';
import type { EmailSenderIdentity } from '@kiki-core-stack/pack/models/email/sender-identity';
import { EmailSenderIdentityModel } from '@kiki-core-stack/pack/models/email/sender-identity';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';
import { isValid } from '@sylke/email-validation';

export const jsonSchema = z.object({
    enabled: z.boolean(),
    from: z
        .string()
        .trim()
        .min(1)
        .refine((value) => {
            return isValid(
                value,
                {
                    allowDisplayText: true,
                    allowDomainLiteral: false,
                    minimumSubDomains: 2,
                },
            );
        }),
    key: z.enum(EmailSenderIdentityKey),
}) satisfies ZodValidatorType<EmailSenderIdentity>;

export const routePermission = 'admin email.senderIdentity.create';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        await EmailSenderIdentityModel.create({
            ...ctx.req.valid('json'),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
