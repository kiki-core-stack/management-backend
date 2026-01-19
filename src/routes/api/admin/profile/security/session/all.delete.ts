import { kickAdminSessions } from '@/libs/admin/auth';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    await kickAdminSessions(ctx.adminId!.toHexString());
    return ctx.createApiSuccessResponse();
});
