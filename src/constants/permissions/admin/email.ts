import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

import { permissionActionLabels } from '../action';

export const email = {
    children: {
        provider: {
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
                toggle: {
                    label: permissionActionLabels.toggle,
                    requires: ['list'],
                },
                update: {
                    label: permissionActionLabels.update,
                    requires: ['list'],
                },
            },
            label: {
                'en': 'Email providers',
                'zh-TW': '電子郵件服務商',
            },
        },
        senderIdentity: {
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
                toggle: {
                    label: permissionActionLabels.toggle,
                    requires: ['list'],
                },
                update: {
                    label: permissionActionLabels.update,
                    requires: ['list'],
                },
            },
            label: {
                'en': 'Email sender identities',
                'zh-TW': '電子郵件寄件身分',
            },
        },
        sendRecord: {
            children: { list: { label: permissionActionLabels.list } },
            label: {
                'en': 'Email send records',
                'zh-TW': '電子郵件發送紀錄',
            },
        },
    },
    label: {
        'en': 'Email',
        'zh-TW': '電子郵件',
    },
} as const satisfies PermissionGroupNode;
