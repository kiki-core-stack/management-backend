import { adminPermissionCatalog } from '@/constants/permissions/admin';

export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})((ctx) => ctx.createApiSuccessResponse({
    groups: adminPermissionCatalog.groups,
    keys: adminPermissionCatalog.keys,
}));
