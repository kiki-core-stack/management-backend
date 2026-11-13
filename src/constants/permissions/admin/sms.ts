import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const sms = {
    children: {
        provider: {
            children: {
                create: {
                    label: {
                        'en': 'Create SMS providers',
                        'zh-TW': '建立簡訊服務商',
                    },
                },
                delete: {
                    label: {
                        'en': 'Delete SMS providers',
                        'zh-TW': '刪除簡訊服務商',
                    },
                },
                list: {
                    label: {
                        'en': 'List SMS providers',
                        'zh-TW': '查看簡訊服務商列表',
                    },
                },
                toggle: {
                    label: {
                        'en': 'Enable or disable SMS providers',
                        'zh-TW': '切換簡訊服務商狀態',
                    },
                },
                update: {
                    label: {
                        'en': 'Update SMS providers',
                        'zh-TW': '更新簡訊服務商',
                    },
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
                        'en': 'List SMS send records',
                        'zh-TW': '查看簡訊發送紀錄列表',
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
