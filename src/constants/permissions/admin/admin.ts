import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const admin = {
    children: {
        account: {
            children: {
                create: {
                    label: {
                        'en': 'Create',
                        'zh-TW': '建立',
                    },
                    requires: [
                        'list',
                        'admin.role.list',
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
            children: {
                list: {
                    label: {
                        'en': 'View list',
                        'zh-TW': '查看列表',
                    },
                },
            },
            label: {
                'en': 'Admin logs',
                'zh-TW': '管理員日誌',
            },
        },
        role: {
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
                update: {
                    label: {
                        'en': 'Update',
                        'zh-TW': '更新',
                    },
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
