import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { Types } from 'mongoose';

import {
    adminAuthenticationSession,
    adminAuthenticationSessionCookieName,
} from '@/constants/admin/authentication-session';
import { honoApp } from '@/core/app';

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

        const session = await adminAuthenticationSession.authenticate(ctx, { ip: getClientIpFromXForwardedFor(ctx)! });
        if (session) {
            ctx.adminId = new Types.ObjectId(session.principalId);
            ctx.adminSessionId = session.id;
        } else if (getCookie(ctx, adminAuthenticationSessionCookieName, 'host')) {
            adminAuthenticationSession.deleteCookie(ctx);
        }

        if (!ctx.routeHandler.noLoginRequired && !ctx.adminId) throwApiError(401);
        ctx.getAdmin = getAdmin.bind(ctx);
        await next();
    },
);
