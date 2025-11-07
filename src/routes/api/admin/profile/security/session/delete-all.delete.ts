import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

export const routePermission = 'ignore';

export default defineRouteHandlers(async (ctx) => {
    await AdminSessionModel.deleteMany({ admin: ctx.adminId });
    return ctx.createApiSuccessResponse();
});
