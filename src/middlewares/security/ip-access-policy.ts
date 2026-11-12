import { assertPlatformIpAccessPolicy } from '@/libs/platform/ip-access-policy';

useRouteMiddleware(
    '/api/*',
    async (ctx, _route, next) => {
        await assertPlatformIpAccessPolicy(ctx);
        await next();
    },
);
