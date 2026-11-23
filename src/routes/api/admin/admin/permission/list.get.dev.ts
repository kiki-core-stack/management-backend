import { selectLocaleCatalogs } from '@kcs-project/pack/i18n/catalogs';

import { adminPermissionCatalog } from '@/constants/permissions/admin';

export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})((ctx) => ctx.createApiSuccessResponse({
    groups: adminPermissionCatalog.groups,
    keys: adminPermissionCatalog.keys,
    labels: selectLocaleCatalogs(appLocaleCatalogs, (messages) => messages.permissions.admin),
    requirements: adminPermissionCatalog.requirements,
}));
