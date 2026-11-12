import { getAdminPermission } from '@/libs/admin/permission';

export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})(async (ctx) => {
    if (!ctx.adminId) return ctx.createApiSuccessResponse();
    return ctx.createApiSuccessResponse({
        id: ctx.adminId,
        permission: await getAdminPermission(ctx.adminId),
    });
});
