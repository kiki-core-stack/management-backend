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
        if (ctx.adminId) await kickAdminSessions(ctx.adminId.toHexString(), token);
        deleteAuthToken(ctx);
    }

    return ctx.createApiSuccessResponse();
});
