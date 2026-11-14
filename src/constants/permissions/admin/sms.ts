import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

import { permissionActionLabels } from '../action';

export const sms = {
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
                'en': 'SMS providers',
                'zh-TW': '簡訊服務商',
            },
        },
        sendRecord: {
            children: { list: { label: permissionActionLabels.list } },
            label: {
                'en': 'SMS send records',
                'zh-TW': '簡訊發送紀錄',
            },
        },
    },
    label: {
        'en': 'SMS',
        'zh-TW': '簡訊',
    },
} as const satisfies PermissionGroupNode;
