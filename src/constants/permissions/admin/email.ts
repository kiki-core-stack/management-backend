import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const email = {
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
        senderIdentity: {
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
