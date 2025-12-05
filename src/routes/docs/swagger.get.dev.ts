import { swaggerUI } from '@hono/swagger-ui';

export const routePermission = 'ignore';

export default defineRouteHandlers(swaggerUI({ url: '/docs/openapi.json' }));
