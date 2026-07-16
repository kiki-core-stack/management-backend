import { redisClient } from '@kiki-core-stack/pack/constants/redis';
import { createHonoAuthenticationSession } from '@kiki-core-stack/pack/hono-backend/libs/authentication-session';
import { createRedisAuthenticationSessionStore } from '@kiki-core-stack/pack/libs/authentication-session/redis-store';

const adminAuthenticationSessionTokenHmacKey = checkAndGetEnvValue(
    'ADMIN_AUTHENTICATION_SESSION_TOKEN_HMAC_KEY',
);

export const adminAuthenticationSessionCookieName = 'admin-token';
export const adminAuthenticationSessionStore = createRedisAuthenticationSessionStore({
    client: redisClient,
    principalType: 'admin',
    tokenHmacKey: adminAuthenticationSessionTokenHmacKey,
});

export const adminAuthenticationSession = createHonoAuthenticationSession({
    cookieName: adminAuthenticationSessionCookieName,
    store: adminAuthenticationSessionStore,
});
