import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

import { permissionActionLabels } from '../action';

export const admin = {
    children: {
        account: {
            children: {
                create: {
                    label: permissionActionLabels.create,
                    requires: [
                        'list',
                        'admin.role.list',
                    ],
                },
                delete: {
                    label: permissionActionLabels.delete,
                    requires: ['list'],
                },
                list: { label: permissionActionLabels.list },
                toggle: {
                    label: permissionActionLabels.toggle,
                    requires: ['list'],
                },
                update: {
                    label: permissionActionLabels.update,
                    requires: [
                        'list',
                        'admin.role.list',
                    ],
                },
            },
            label: {
                'en': 'Admin accounts',
                'zh-TW': '管理員帳號',
            },
        },
        log: {
            children: { list: { label: permissionActionLabels.list } },
            label: {
                'en': 'Admin logs',
                'zh-TW': '管理員日誌',
            },
        },
        role: {
            children: {
                create: {
                    label: permissionActionLabels.create,
                    requires: ['list'],
                },
                delete: {
                    label: permissionActionLabels.delete,
                    requires: ['list'],
                },
                list: { label: permissionActionLabels.list },
                update: {
                    label: permissionActionLabels.update,
                    requires: ['list'],
                },
            },
            label: {
                'en': 'Admin roles',
                'zh-TW': '管理員身分組',
            },
        },
    },
    label: {
        'en': 'Admins',
        'zh-TW': '管理員',
    },
} as const satisfies PermissionGroupNode;
