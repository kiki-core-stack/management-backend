import type { PermissionTree } from '@kcs-project/pack/types/permission';

export const admin = {
    create: true,
    delete: true,
    list: true,
    log: { list: true },
    role: {
        create: true,
        delete: true,
        list: true,
        update: true,
    },
    toggle: true,
    update: true,
} as const satisfies PermissionTree;
