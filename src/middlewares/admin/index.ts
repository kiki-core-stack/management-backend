import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import {
    isBefore,
    subMinutes,
} from 'date-fns';
import type { Context } from 'hono';
import { Types } from 'mongoose';

import { honoApp } from '@/core/app';
import { createOrUpdateAdminSessionAndSetAuthToken } from '@/libs/admin/auth';
import {
    deleteAuthToken,
    getAuthToken,
} from '@/libs/auth';

declare module 'hono' {
    interface Context {
        getAdmin: { (): Promise<AdminDocument> };
    }
}

async function getAdmin(this: Context) {
    const admin = await AdminModel.findById(this.adminId);
    if (!admin) throwApiError();
    return admin;
}

honoApp.use(
    '/api/admin/*',
    async (ctx, next) => {
        if (!ctx.routeHandler?.isHandler) return await next();
        const token = getAuthToken(ctx);
        if (token) {
            const adminSession = await redisStore.adminSession.getItem(token);
            if (!adminSession) deleteAuthToken(ctx);
            else {
                ctx.adminId = new Types.ObjectId(adminSession.adminId);
                ctx.adminSessionId = new Types.ObjectId(adminSession.id);
                if (isBefore(adminSession.lastActiveAt, subMinutes(new Date(), 10))) {
                    await createOrUpdateAdminSessionAndSetAuthToken(
                        ctx,
                        adminSession.adminId,
                        {
                            oldToken: token,
                            sessionId: adminSession.id,
                        },
                    );
                }
            }
        }

        if (!ctx.routeHandler.noLoginRequired && !ctx.adminId) throwApiError(401);
        ctx.getAdmin = getAdmin.bind(ctx);
        await next();
    },
);
