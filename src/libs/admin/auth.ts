import { AdminLogType } from '@kcs-project/pack/constants/admin';
import { PlatformScope } from '@kcs-project/pack/constants/platform';
import { createAdminLog } from '@kcs-project/pack/libs/admin';
import type { AdminDocument } from '@kcs-project/pack/models/admin';
import type { Context } from 'hono';

import { adminAuthenticationSession } from '@/constants/admin/authentication-session';
import { assertPlatformIpAccessPolicy } from '@/libs/platform/ip-access-policy';

export async function loginAdmin(ctx: Context, admin: AdminDocument, logNote?: string) {
    await assertPlatformIpAccessPolicy(ctx, PlatformScope.AdminManagement, admin._id);
    const ip = getClientIp(ctx)!;
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
    const ip = getClientIp(ctx)!;
    createAdminLog({
        admin: adminId,
        ip,
        note,
        type: AdminLogType.LoginSuccess,
    }).catch(logger.error);
}
