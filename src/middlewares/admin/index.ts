import { Types } from 'mongoose';

import { adminAuth } from '@/constants/admin/auth';

useRouteMiddleware(
    '/api/admin/*',
    async (ctx, route, next) => {
        await adminAuth.authenticate(ctx, route.meta);
        if (ctx.authSession) ctx.adminId = new Types.ObjectId(ctx.authSession.principalId);
        await next();
    },
);
