import type { PermissionTree } from '@kcs-project/pack/types/permission';

export const admin = {
    account: {
        create: true,
        delete: true,
        list: true,
        toggle: true,
        update: true,
    },
    log: { list: true },
    role: {
        create: true,
        delete: true,
        list: true,
        update: true,
    },
} as const satisfies PermissionTree;
