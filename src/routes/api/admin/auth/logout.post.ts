import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

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
        await AdminSessionModel.deleteOne({ token });
        deleteAuthToken(ctx);
    }

    return ctx.createApiSuccessResponse();
});
