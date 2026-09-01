import { AdminLogType } from '@kcs-project/pack/constants/admin';
import type { AdminDocument } from '@kcs-project/pack/models/admin';
import { AdminLogModel } from '@kcs-project/pack/models/admin/log';
import type { Context } from 'hono';

import { adminAuthenticationSession } from '@/constants/admin/authentication-session';

export async function handleAdminLogin(ctx: Context, admin: AdminDocument, logNote?: string) {
    const ip = getClientIpFromXForwardedFor(ctx)!;
    await adminAuthenticationSession.create(
        ctx,
        {
            ip,
            principalAuthenticationRevision: admin.authenticationRevision,
            principalId: admin._id.toHexString(),
            userAgent: ctx.req.header('user-agent'),
        },
    );

    await recordAdminLogin(ctx, admin._id.toHexString(), logNote);
}

export async function recordAdminLogin(ctx: Context, adminId: string, note?: string) {
    const ip = getClientIpFromXForwardedFor(ctx)!;
    await AdminLogModel
        .create({
            admin: adminId,
            ip,
            note,
            type: AdminLogType.LoginSuccess,
        })
        .catch(logger.error);
}
