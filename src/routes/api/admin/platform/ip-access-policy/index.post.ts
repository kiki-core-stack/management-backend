import {
    PlatformIpAccessPolicyMode,
    PlatformIpAccessPolicyScope,
} from '@kcs-project/pack/constants/platform';
import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { AdminModel } from '@kcs-project/pack/models/admin';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';
import type { PlatformIpAccessPolicy } from '@kcs-project/pack/models/platform/ip-access-policy';
import { ipAddressOrCidrSchema } from '@kcs-project/pack/schemas/ip';
import type { ZodValidatorType } from '@kcs-project/pack/types';

const targetSchema = z.union([
    z.object({
        principalIds: z.null(),
        principalType: z.null(),
        scope: z.null(),
    }),
    z.object({
        principalIds: z.null(),
        principalType: z.null(),
        scope: z.enum(PlatformIpAccessPolicyScope),
    }),
    z.object({
        principalIds: z
            .array(z.objectId().refine(
                (_id) => AdminModel.exists({ _id }),
                z.i18nIssue({
                    'en': 'The admin does not exist',
                    'zh-TW': '管理員不存在',
                }),
            ))
            .min(1)
            .nullable(),
        principalType: z.literal('admin'),
        scope: z.literal(PlatformIpAccessPolicyScope.AdminManagement),
    }),
]);

export const jsonSchema = z.object({
    enabled: z.boolean(),
    ipEntries: z.array(ipAddressOrCidrSchema).min(1),
    mode: z.enum(PlatformIpAccessPolicyMode),
    name: z.string().trim().min(1).max(64),
    note: z.blankToUndefined(z.string().trim()),
    targets: z.array(targetSchema).min(1).refine(
        (targets) => targets.length === 1 || targets.every((target) => target.scope !== null),
        z.i18nIssue({
            'en': 'A global target cannot be combined with other targets',
            'zh-TW': '全域 API 目標不能與其他目標同時設定',
        }),
    ),
}) satisfies ZodValidatorType<PlatformIpAccessPolicy>;

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.create })(
    apiValidator('json', jsonSchema),
    async (ctx) => {
        await PlatformIpAccessPolicyModel.create({
            ...ctx.req.valid('json'),
            createdByAdmin: ctx.adminId,
        });

        await clearPlatformIpAccessPolicyCache().catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
