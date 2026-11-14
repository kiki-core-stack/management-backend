import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

import { permissionActionLabels } from '../action';

export const platform = {
    children: {
        config: {
            children: {
                list: { label: permissionActionLabels.list },
                update: {
                    label: permissionActionLabels.update,
                    requires: ['list'],
                },
            },
            label: {
                'en': 'Platform configs',
                'zh-TW': '平台設定',
            },
        },
        ipAccessPolicy: {
            children: {
                create: {
                    label: permissionActionLabels.create,
                    requires: [
                        'list',
                        'admin.account.list',
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
                        'admin.account.list',
                    ],
                },
            },
            label: {
                'en': 'IP access policies',
                'zh-TW': 'IP 存取規則',
            },
        },
    },
    label: {
        'en': 'Platform',
        'zh-TW': '平台',
    },
} as const satisfies PermissionGroupNode;
