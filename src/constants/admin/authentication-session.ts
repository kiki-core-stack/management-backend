import { redisClient } from '@kiki-core-stack/pack/constants/redis';
import { createHonoAuthenticationSession } from '@kiki-core-stack/pack/hono-backend/libs/authentication-session';
import { createRedisAuthenticationSessionStore } from '@kiki-core-stack/pack/libs/authentication-session/redis-store';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';

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
