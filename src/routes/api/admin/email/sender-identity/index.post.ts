import { EmailSenderIdentityKey } from '@kcs-project/pack/constants/email';
import type { EmailSenderIdentity } from '@kcs-project/pack/models/email/sender-identity';
import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';
import type { ZodValidatorType } from '@kcs-project/pack/types';
import { isValid } from '@sylke/email-validation';

export const jsonSchema = z.object({
    enabled: z.boolean(),
    from: z
        .string()
        .trim()
        .min(1)
        .refine(
            (value) => isValid(
                value,
                {
                    allowDisplayText: true,
                    allowDomainLiteral: false,
                    minimumSubDomains: 2,
                },
            ),
            z.i18nIssue({
                'en': 'Enter a valid sender address',
                'zh-TW': '請輸入有效的寄件地址',
            }),
        ),
    key: z.enum(EmailSenderIdentityKey),
}) satisfies ZodValidatorType<EmailSenderIdentity>;

export default defineRoute({ permission: adminPermissions.email.senderIdentity.create })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        await EmailSenderIdentityModel.create({
            ...ctx.req.valid('json'),
            createdByAdmin: ctx.adminId,
        });

        return ctx.createApiSuccessResponse();
    },
);
