import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const home = {
    children: {
        dashboard: {
            children: {
                view: {
                    label: {
                        'en': 'View',
                        'zh-TW': '查看',
                    },
                },
            },
            label: {
                'en': 'Home dashboard',
                'zh-TW': '首頁儀表板',
            },
        },
    },
    label: {
        'en': 'Home',
        'zh-TW': '首頁',
    },
} as const satisfies PermissionGroupNode;
