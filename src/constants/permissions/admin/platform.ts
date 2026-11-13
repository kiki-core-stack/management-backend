import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const platform = {
    children: {
        config: {
            children: {
                list: {
                    label: {
                        'en': 'List platform configs',
                        'zh-TW': '查看平台設定列表',
                    },
                },
                update: {
                    label: {
                        'en': 'Update platform configs',
                        'zh-TW': '更新平台設定',
                    },
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
                        'en': 'Create IP access policies',
                        'zh-TW': '建立IP 存取規則',
                    },
                },
                delete: {
                    label: {
                        'en': 'Delete IP access policies',
                        'zh-TW': '刪除IP 存取規則',
                    },
                },
                list: {
                    label: {
                        'en': 'List IP access policies',
                        'zh-TW': '查看IP 存取規則列表',
                    },
                },
                toggle: {
                    label: {
                        'en': 'Enable or disable IP access policies',
                        'zh-TW': '切換IP 存取規則狀態',
                    },
                },
                update: {
                    label: {
                        'en': 'Update IP access policies',
                        'zh-TW': '更新IP 存取規則',
                    },
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
