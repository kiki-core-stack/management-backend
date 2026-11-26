import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const admin = {
    children: {
        account: {
            children: {
                create: {
                    requires: [
                        'list',
                        'admin.role.list',
                    ],
                },
                delete: { requires: ['list'] },
                list: {},
                manageSecurity: { requires: ['list'] },
                toggle: { requires: ['list'] },
                update: {
                    requires: [
                        'list',
                        'admin.role.list',
                    ],
                },
            },
        },
        log: { children: { list: { requires: ['admin.account.list'] } } },
        role: {
            children: {
                create: { requires: ['list'] },
                delete: { requires: ['list'] },
                list: {},
                update: { requires: ['list'] },
            },
        },
    },
} as const satisfies PermissionGroupNode;
