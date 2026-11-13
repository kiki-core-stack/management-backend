import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const admin = {
    children: {
        account: {
            children: {
                create: {
                    label: {
                        'en': 'Create admin accounts',
                        'zh-TW': '建立管理員帳號',
                    },
                },
                delete: {
                    label: {
                        'en': 'Delete admin accounts',
                        'zh-TW': '刪除管理員帳號',
                    },
                },
                list: {
                    label: {
                        'en': 'List admin accounts',
                        'zh-TW': '查看管理員帳號列表',
                    },
                },
                toggle: {
                    label: {
                        'en': 'Enable or disable admin accounts',
                        'zh-TW': '切換管理員帳號狀態',
                    },
                },
                update: {
                    label: {
                        'en': 'Update admin accounts',
                        'zh-TW': '更新管理員帳號',
                    },
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
                        'en': 'List admin logs',
                        'zh-TW': '查看管理員日誌列表',
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
                        'en': 'Create admin roles',
                        'zh-TW': '建立管理員身分組',
                    },
                },
                delete: {
                    label: {
                        'en': 'Delete admin roles',
                        'zh-TW': '刪除管理員身分組',
                    },
                },
                list: {
                    label: {
                        'en': 'List admin roles',
                        'zh-TW': '查看管理員身分組列表',
                    },
                },
                update: {
                    label: {
                        'en': 'Update admin roles',
                        'zh-TW': '更新管理員身分組',
                    },
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
