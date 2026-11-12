import type { PermissionTree } from '@kcs-project/pack/types/permission';

export const sms = {
    provider: {
        create: true,
        delete: true,
        list: true,
        toggle: true,
        update: true,
    },
    sendRecord: { list: true },
} as const satisfies PermissionTree;
