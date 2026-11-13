import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const email = {
    children: {
        provider: {
            children: {
                create: {
                    label: {
                        'en': 'Create email providers',
                        'zh-TW': '建立電子郵件服務商',
                    },
                },
                delete: {
                    label: {
                        'en': 'Delete email providers',
                        'zh-TW': '刪除電子郵件服務商',
                    },
                },
                list: {
                    label: {
                        'en': 'List email providers',
                        'zh-TW': '查看電子郵件服務商列表',
                    },
                },
                toggle: {
                    label: {
                        'en': 'Enable or disable email providers',
                        'zh-TW': '切換電子郵件服務商狀態',
                    },
                },
                update: {
                    label: {
                        'en': 'Update email providers',
                        'zh-TW': '更新電子郵件服務商',
                    },
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
                        'en': 'Create email sender identities',
                        'zh-TW': '建立電子郵件寄件身分',
                    },
                },
                delete: {
                    label: {
                        'en': 'Delete email sender identities',
                        'zh-TW': '刪除電子郵件寄件身分',
                    },
                },
                list: {
                    label: {
                        'en': 'List email sender identities',
                        'zh-TW': '查看電子郵件寄件身分列表',
                    },
                },
                toggle: {
                    label: {
                        'en': 'Enable or disable email sender identities',
                        'zh-TW': '切換電子郵件寄件身分狀態',
                    },
                },
                update: {
                    label: {
                        'en': 'Update email sender identities',
                        'zh-TW': '更新電子郵件寄件身分',
                    },
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
                        'en': 'List email send records',
                        'zh-TW': '查看電子郵件發送紀錄列表',
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
