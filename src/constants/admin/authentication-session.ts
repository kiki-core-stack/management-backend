import { redisClient } from '@kcs-project/pack/connections/redis';
import { PlatformIpAccessPolicyScope } from '@kcs-project/pack/constants/platform';
import { createHonoAuthenticationSession } from '@kcs-project/pack/hono-backend/libs/authentication-session';
import { createRedisAuthenticationSessionStore } from '@kcs-project/pack/libs/authentication-session/redis-store';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { AuthenticationSessionPrincipalValidationData } from '@kcs-project/pack/types/authentication-session';

import { assertPlatformIpAccessPolicy } from '@/libs/platform/ip-access-policy';

export async function validateAdminAuthenticationSessionPrincipal(data: AuthenticationSessionPrincipalValidationData) {
    return !!await AdminModel.exists({
        _id: data.principalId,
        authenticationRevision: data.principalAuthenticationRevision,
        enabled: true,
    });
}

export const adminAuthenticationSessionStore = createRedisAuthenticationSessionStore({
    client: redisClient,
    principalType: 'admin',
    tokenHmacKey: checkAndGetEnvValue('ADMIN_AUTHENTICATION_SESSION_TOKEN_HMAC_KEY'),
});

export const adminAuthenticationSession = createHonoAuthenticationSession({
    cookieName: 'admin-token',
    store: adminAuthenticationSessionStore,
    async validatePrincipal(ctx, data) {
        if (!await validateAdminAuthenticationSessionPrincipal(data)) return false;
        await assertPlatformIpAccessPolicy(ctx, PlatformIpAccessPolicyScope.AdminManagement, 'admin', data.principalId);
        return true;
    },
});
