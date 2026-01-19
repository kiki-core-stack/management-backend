import { redisClient } from '@kiki-core-stack/pack/constants/redis';
import type { AdminSessionData } from '@kiki-core-stack/pack/types/data/admin';

import { getAuthToken } from '@/libs/auth';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const adminSessionTokens = await redisClient.smembers(`admin:sessions:${ctx.adminId!.toHexString()}`);
    const adminSessions = await Promise
        .all(
            adminSessionTokens.map(async (token) => {
                const adminSession = await redisStore.adminSession.getItem(token);
                if (!adminSession) return;
                return {
                    ...adminSession,
                    token,
                };
            }),
        )
        .then((adminSessions) => adminSessions.filter((adminSession) => adminSession !== undefined));

    const token = getAuthToken(ctx);
    const adminSessionList: AdminSessionData[] = [];
    for (const { token: adminSessionToken, ...adminSession } of adminSessions) {
        if (!adminSession) continue;
        if (adminSessionToken === token) adminSessionList.unshift(adminSession);
        else adminSessionList.push(adminSession);
    }

    adminSessionList[0]!.isCurrent = true;
    return ctx.createApiSuccessResponse({
        count: adminSessionList.length,
        list: adminSessionList,
    });
});
