import { assertPermission } from '@kcs-project/pack/hono-backend/libs/permission';

import { getAdminPermission } from '@/libs/admin/permission';

useRouteMiddleware(
    '/api/admin/*',
    async (ctx, route, next) => {
        if (route.meta.noLoginRequired || route.meta.permission === 'ignore') return await next();
        assertPermission(await getAdminPermission(ctx.adminId!), route.meta.permission);
        await next();
    },
);
