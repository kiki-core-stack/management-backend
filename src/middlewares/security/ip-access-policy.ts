import { honoApp } from '@/core/app';
import { assertPlatformIpAccessPolicy } from '@/libs/platform/ip-access-policy';

honoApp.use(
    '/api/*',
    async (ctx, next) => {
        if (!ctx.routeHandler?.isHandler) return next();
        await assertPlatformIpAccessPolicy(ctx);
        return next();
    },
);
