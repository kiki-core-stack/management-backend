import type { PlatformScope } from '@kcs-project/pack/constants/platform';
import { checkPlatformIpAccessPolicy } from '@kcs-project/pack/libs/platform/ip-access-policy';
import type { Context } from 'hono';
import type { Types } from 'mongoose';

export async function assertPlatformIpAccessPolicy(
    ctx: Context,
    scope?: PlatformScope,
    principalId?: string | Types.ObjectId,
) {
    const platformIpAccessPolicyCheckResult = await checkPlatformIpAccessPolicy(
        getClientIp(ctx),
        scope,
        principalId?.toString(),
    );

    if (!platformIpAccessPolicyCheckResult.allowed) throwApiError(apiErrors.common.forbidden);
}
