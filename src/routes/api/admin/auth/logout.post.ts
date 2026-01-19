import { kickAdminSessions } from '@/libs/admin/auth';
import {
    deleteAuthToken,
    getAuthToken,
} from '@/libs/auth';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    ctx.clearSession();
    const token = getAuthToken(ctx);
    if (token) {
        const adminId = ctx.adminId?.toHexString();
        if (adminId) await kickAdminSessions(adminId, token);
        deleteAuthToken(ctx);
    }

    return ctx.createApiSuccessResponse();
});
