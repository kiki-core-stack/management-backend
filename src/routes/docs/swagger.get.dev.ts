import { swaggerUI } from '@hono/swagger-ui';

export default defineRoute({ permission: 'ignore' })(swaggerUI({ url: '/docs/openapi.json' }));
