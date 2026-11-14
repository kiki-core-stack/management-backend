import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

import { permissionActionLabels } from '../action';

export const home = {
    children: {
        dashboard: {
            children: { view: { label: permissionActionLabels.view } },
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
