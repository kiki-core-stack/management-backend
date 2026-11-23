import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const platform = {
    children: {
        config: {
            children: {
                list: {},
                update: { requires: ['list'] },
            },
        },
        ipAccessPolicy: {
            children: {
                create: {
                    requires: [
                        'list',
                        'admin.account.list',
                    ],
                },
                delete: { requires: ['list'] },
                list: {},
                toggle: { requires: ['list'] },
                update: {
                    requires: [
                        'list',
                        'admin.account.list',
                    ],
                },
            },
        },
    },
} as const satisfies PermissionGroupNode;
