import { allAdminPermissions } from '@/constants/admin';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers((ctx) => ctx.createApiSuccessResponse([...allAdminPermissions].sort()));
