import { AdminLogType } from '@kiki-core-stack/pack/constants/admin';
import { redisClient } from '@kiki-core-stack/pack/constants/redis';
import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';
import type { AdminSessionData } from '@kiki-core-stack/pack/types/data/admin';
import type { MaybeReadonly } from '@kikiutils/shared/types';
import type { Context } from 'hono';
import { Types } from 'mongoose';
import type { Arrayable } from 'type-fest';

import { setAuthToken } from '../auth';

export async function createOrUpdateAdminSessionAndSetAuthToken(
    ctx: Context,
    adminId: string,
    options?: {
        ip?: string;
        oldToken?: string;
        sessionId?: string;
    },
) {
    const ip = options?.ip || getClientIpFromXForwardedFor(ctx)!;
    const oldAdminSession = options?.oldToken ? await redisStore.adminSession.getItem(options.oldToken) : undefined;
    const adminSessionId = options?.sessionId || new Types.ObjectId().toHexString();
    const adminSessionData: AdminSessionData = {
        adminId,
        id: adminSessionId,
        lastActiveAt: new Date(),
        lastActiveIp: ip,
        loggedAt: oldAdminSession?.loggedAt || new Date(),
        loginIp: oldAdminSession?.loginIp || ip,
        userAgent: ctx.req.header('user-agent'),
    };

    const adminSessionsSetKey = `admin:sessions:${adminId}`;
    const newToken = generateWithNestedRandomLength(nanoid, 48, 64, 80, 96);
    const redisValueTtlSeconds = 60 * 60 * 24 * 7;

    const promises: Promise<any>[] = [
        redisStore.adminSession.setItemWithTtl(redisValueTtlSeconds, adminSessionData, newToken),
        redisStore.adminSessionToken.setItemWithTtl(redisValueTtlSeconds, newToken, adminSessionId),
    ];

    if (options?.oldToken && options.sessionId) {
        promises.push(
            redisClient.expire(redisStore.adminSession.resolveKey(options.oldToken), 30),
            redisClient.srem(adminSessionsSetKey, options.oldToken),
        );
    }

    promises.push(
        redisClient.sadd(adminSessionsSetKey, newToken),
        redisClient.expire(adminSessionsSetKey, redisValueTtlSeconds),
    );

    await Promise.all(promises);

    setAuthToken(ctx, newToken);
}

export async function handleAdminLogin(ctx: Context, adminId: Types.ObjectId, logNote?: string) {
    const ip = getClientIpFromXForwardedFor(ctx);
    await AdminLogModel.create({
        admin: adminId,
        ip,
        note: logNote,
        type: AdminLogType.LoginSuccess,
    });

    await createOrUpdateAdminSessionAndSetAuthToken(ctx, adminId.toHexString(), { ip });
}

export async function kickAdminSessions(adminId: string, ...tokens: MaybeReadonly<Arrayable<string>>[]) {
    const resolvedTokens = tokens.flat();
    const sessionsSetKey = `admin:sessions:${adminId}`;
    const adminSessionTokens = resolvedTokens.length ? resolvedTokens : await redisClient.smembers(sessionsSetKey);
    const adminSessions = await Promise.all(
        adminSessionTokens.map(async (token) => {
            const adminSession = await redisStore.adminSession.getItem(token);
            await Promise.all([
                redisClient.srem(sessionsSetKey, token),
                redisStore.adminSession.removeItem(token),
            ]);

            return adminSession;
        }),
    );

    const adminSessionIds = adminSessions.map((adminSession) => adminSession?.id).filter((id) => id !== undefined);
    if (adminSessionIds.length) {
        await redisClient.del(...adminSessionIds.map((id) => redisStore.adminSessionToken.resolveKey(id)));
    }
}
