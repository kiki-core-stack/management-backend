import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const sms = {
    children: {
        provider: {
            children: {
                create: {
                    label: {
                        'en': 'Create',
                        'zh-TW': '建立',
                    },
                    requires: ['list'],
                },
                delete: {
                    label: {
                        'en': 'Delete',
                        'zh-TW': '刪除',
                    },
                    requires: ['list'],
                },
                list: {
                    label: {
                        'en': 'View list',
                        'zh-TW': '查看列表',
                    },
                },
                toggle: {
                    label: {
                        'en': 'Enable or disable',
                        'zh-TW': '啟用／停用',
                    },
                    requires: ['list'],
                },
                update: {
                    label: {
                        'en': 'Update',
                        'zh-TW': '更新',
                    },
                    requires: ['list'],
                },
            },
            label: {
                'en': 'SMS providers',
                'zh-TW': '簡訊服務商',
            },
        },
        sendRecord: {
            children: {
                list: {
                    label: {
                        'en': 'View list',
                        'zh-TW': '查看列表',
                    },
                },
            },
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
