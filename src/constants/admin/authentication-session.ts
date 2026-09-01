import { redisClient } from '@kcs-project/pack/constants/redis';
import { createHonoAuthenticationSession } from '@kcs-project/pack/hono-backend/libs/authentication-session';
import { createRedisAuthenticationSessionStore } from '@kcs-project/pack/libs/authentication-session/redis-store';
import { AdminModel } from '@kcs-project/pack/models/admin';

export const adminAuthenticationSessionStore = createRedisAuthenticationSessionStore({
    client: redisClient,
    principalType: 'admin',
    tokenHmacKey: checkAndGetEnvValue('ADMIN_AUTHENTICATION_SESSION_TOKEN_HMAC_KEY'),
});

export const adminAuthenticationSession = createHonoAuthenticationSession({
    cookieName: 'admin-token',
    store: adminAuthenticationSessionStore,
    validatePrincipal: async (_ctx, data) => {
        return !!await AdminModel.exists({
            _id: data.principalId,
            authenticationRevision: data.principalAuthenticationRevision,
            enabled: true,
        });
    },
});
