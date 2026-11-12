import type { PermissionTree } from '@kcs-project/pack/types/permission';

export const platform = {
    config: {
        list: true,
        update: true,
    },
    ipAccessPolicy: {
        create: true,
        delete: true,
        list: true,
        toggle: true,
        update: true,
    },
} as const satisfies PermissionTree;
