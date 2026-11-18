import { assertPlatformIpAccessPolicy } from '@/libs/platform/ip-access-policy';

useRouteMiddleware(
    '/api/*',
    async (ctx, _route, next) => {
        // Internal routes are called by other services and authenticate on their own; the policy is for clients.
        if (!ctx.req.path.startsWith('/api/internal/')) await assertPlatformIpAccessPolicy(ctx);
        await next();
    },
);
