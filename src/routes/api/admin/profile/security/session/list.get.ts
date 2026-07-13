import { redisClient } from '@kiki-core-stack/pack/constants/redis';
import type { AdminSessionData } from '@kiki-core-stack/pack/types/data/admin';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    const adminSessionTokens = await redisClient.smembers(`admin:sessions:${ctx.adminId!.toHexString()}`);
    const adminSessions = await Promise
        .all(adminSessionTokens.map((token) => redisStore.adminSession.getItem(token)))
        .then((adminSessions) => adminSessions.filter((adminSession) => adminSession !== null));

    const currentSessionId = ctx.adminSessionId!.toHexString();
    const adminSessionList: AdminSessionData[] = [];
    for (const adminSession of adminSessions) {
        if (adminSession.id !== currentSessionId) adminSessionList.push(adminSession);
        else {
            adminSessionList.unshift({
                ...adminSession,
                isCurrent: true,
            });
        }
    }

    return ctx.createApiSuccessResponse({
        count: adminSessionList.length,
        list: adminSessionList,
    });
});
