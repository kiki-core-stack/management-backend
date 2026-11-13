import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const email = {
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
                'en': 'Email providers',
                'zh-TW': '電子郵件服務商',
            },
        },
        senderIdentity: {
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
                'en': 'Email sender identities',
                'zh-TW': '電子郵件寄件身分',
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
