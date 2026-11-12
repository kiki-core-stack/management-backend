import { PlatformIpAccessPolicyScope } from '@kcs-project/pack/constants/platform';
import { Types } from 'mongoose';

import { adminAuthenticationSession } from '@/constants/admin/authentication-session';
import { assertPlatformIpAccessPolicy } from '@/libs/platform/ip-access-policy';

useRouteMiddleware(
    '/api/admin/*',
    async (ctx, route, next) => {
        const session = await adminAuthenticationSession.authenticate(ctx, { ip: getClientIp(ctx)! });
        if (session) {
            ctx.adminAuthenticationSession = session;
            ctx.adminId = new Types.ObjectId(session.principalId);
        }

        await assertPlatformIpAccessPolicy(
            ctx,
            PlatformIpAccessPolicyScope.AdminManagement,
            'admin',
            session?.principalId,
        );

        if (!route.meta.noLoginRequired && !ctx.adminId) throwApiError(apiErrors.common.unauthorized);
        await next();
    },
);
