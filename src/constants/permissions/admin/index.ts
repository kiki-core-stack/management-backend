import { definePermissions } from '@kcs-project/pack/libs/permission';

import { admin } from './admin';
import { email } from './email';
import { home } from './home';
import { platform } from './platform';
import { sms } from './sms';

// Add this repo's own domains as new files and list them here, e.g. `forum`.

/**
 * Single source of admin permission keys. Routes reference `adminPermissions.<group>.<action>`; the admin frontend
 * receives the same catalog through the generated permission file.
 */
export const adminPermissionCatalog = definePermissions({
    admin,
    email,
    home,
    platform,
    sms,
});

export const adminPermissions = adminPermissionCatalog.permissions;
