import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const sms = {
    children: {
        provider: {
            children: {
                create: { requires: ['list'] },
                delete: { requires: ['list'] },
                list: {},
                toggle: { requires: ['list'] },
                update: { requires: ['list'] },
            },
        },
        sendRecord: { children: { list: {} } },
    },
} as const satisfies PermissionGroupNode;
