import { Scalar } from '@scalar/hono-api-reference';

export const routePermission = 'ignore';

export default defineRouteHandlers(Scalar({ url: '/docs/openapi.json' }));
