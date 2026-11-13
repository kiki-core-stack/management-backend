import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const platform = {
    children: {
        config: {
            children: {
                list: {
                    label: {
                        'en': 'View list',
                        'zh-TW': '查看列表',
                    },
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
                'en': 'Platform configs',
                'zh-TW': '平台設定',
            },
        },
        ipAccessPolicy: {
            children: {
                create: {
                    label: {
                        'en': 'Create',
                        'zh-TW': '建立',
                    },
                    requires: [
                        'list',
                        'admin.account.list',
                    ],
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
