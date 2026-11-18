import { checkPlatformIpAccessPolicy } from '@kcs-project/pack/libs/platform/ip-access-policy';

useRouteMiddleware(
    '/api/*',
    async (ctx, _route, next) => {
        // Internal routes are called by other services and authenticate on their own; the policy is for clients.
        // Only the system scope is checked here; each realm checks its own scope and account when authenticating.
        if (
            !ctx.req.path.startsWith('/api/internal/')
            && !(await checkPlatformIpAccessPolicy(getClientIp(ctx))).allowed
        ) throwApiError(apiErrors.common.forbidden);

        await next();
    },
);
