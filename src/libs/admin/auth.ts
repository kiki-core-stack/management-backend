import { AdminLogType } from '@kiki-core-stack/pack/constants/admin';
import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';
import type { Context } from 'hono';
import type { Types } from 'mongoose';

import { adminAuthenticationSession } from '@/constants/admin/authentication-session';

export async function handleAdminLogin(ctx: Context, adminId: Types.ObjectId, logNote?: string) {
    const ip = getClientIpFromXForwardedFor(ctx)!;
    await AdminLogModel.create({
        admin: adminId,
        ip,
        note: logNote,
        type: AdminLogType.LoginSuccess,
    });

    await adminAuthenticationSession.create(
        ctx,
        {
            ip,
            principalId: adminId.toHexString(),
            userAgent: ctx.req.header('user-agent'),
        },
    );
}
