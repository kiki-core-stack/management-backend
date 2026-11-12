import { Scalar } from '@scalar/hono-api-reference';

export default defineRoute({ permission: 'ignore' })(Scalar({ url: '/docs/openapi.json' }));
