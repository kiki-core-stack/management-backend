// One-time startup setups (side effects). Imported first by src/index.ts.

import '@kcs-project/pack/hono-backend/setups/mongoose-model-extensions/assert-update-if-not-modified';
import '@kcs-project/pack/hono-backend/setups/mongoose-model-extensions/find-by-route-id-or-throw-not-found-error';
import '@kcs-project/pack/hono-backend/setups/mongoose-model-extensions';
import './admin-context';
import './hono-context';

import { setupHonoAppErrorHandling } from '@kcs-project/pack/hono-backend/setups/error-handling';

import { honoApp } from '@/core/app';

setupHonoAppErrorHandling(honoApp, logger);
