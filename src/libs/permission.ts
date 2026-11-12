import { objectKeys } from 'ts-extras';

import { permissionCatalogs } from '@/constants/permissions';
import type { PrincipalType } from '@/constants/permissions';
import { getRegisteredRoutes } from '@/core/libs/router/registry';

/**
 * Checks route permission wiring against the catalogs; call after routes load (development only).
 *
 * - Throws when a route requires a permission that is not in the catalog of the principal type in its path.
 * - Warns about catalog permissions that no route requires.
 */
export function checkRoutePermissionWiring() {
    const principalTypes = objectKeys(permissionCatalogs);
    const invalidRoutes: string[] = [];
    const usedPermissionsMap = new Map<PrincipalType, Set<string>>();
    for (const type of principalTypes) usedPermissionsMap.set(type, new Set());

    for (const route of getRegisteredRoutes()) {
        const permission: string = route.meta.permission;
        if (permission === 'ignore') continue;
        const principalType = principalTypes.find((type) => route.path.startsWith(`/api/${type}/`));
        const catalog = principalType && permissionCatalogs[principalType];
        if (!catalog || !(catalog.keys as readonly string[]).includes(permission)) {
            invalidRoutes.push(`  - ${route.method.toUpperCase()} ${route.path} (${route.filePath}): ${permission}`);
            continue;
        }

        usedPermissionsMap.get(principalType)!.add(permission);
    }

    if (invalidRoutes.length) {
        throw new Error(`Routes require permissions outside their principal's catalog:\n${invalidRoutes.join('\n')}`);
    }

    for (const [type, usedPermissions] of usedPermissionsMap) {
        const unusedPermissions = permissionCatalogs[type].keys.filter((key) => !usedPermissions.has(key));
        if (unusedPermissions.length) {
            logger.warn(`Permissions of "${type}" not used by any route:\n${unusedPermissions.map((key) => `  - ${key}`).join('\n')}`);
        }
    }
}
