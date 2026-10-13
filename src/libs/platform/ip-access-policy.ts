import type { PlatformIpAccessPolicyScope } from '@kcs-project/pack/constants/platform';
import { checkPlatformIpAccessPolicy } from '@kcs-project/pack/libs/platform/ip-access-policy';
import type { AuthenticationSessionPrincipalType } from '@kcs-project/pack/types/authentication-session';
import type { Context } from 'hono';
import type { Types } from 'mongoose';

export async function assertPlatformIpAccessPolicy(
    ctx: Context,
    scope?: PlatformIpAccessPolicyScope,
    principalType?: AuthenticationSessionPrincipalType,
    principalId?: string | Types.ObjectId,
) {
    const platformIpAccessPolicyCheckResult = await checkPlatformIpAccessPolicy(
        getClientIpFromXForwardedFor(ctx),
        scope,
        principalType,
        principalId?.toString(),
    );

    if (!platformIpAccessPolicyCheckResult.allowed) throwApiError(403);
}
