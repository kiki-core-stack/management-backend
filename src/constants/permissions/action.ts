import type { LocalizedMessages } from '@kcs-project/pack/types/i18n';

/**
 * Labels of the common permission actions, shared by every principal type's permissions; add this repo's own actions
 * (e.g. `export`) here.
 */
export const permissionActionLabels = {
    create: {
        'en': 'Create',
        'zh-TW': '建立',
    },
    delete: {
        'en': 'Delete',
        'zh-TW': '刪除',
    },
    list: {
        'en': 'View list',
        'zh-TW': '查看列表',
    },
    toggle: {
        'en': 'Enable or disable',
        'zh-TW': '啟用／停用',
    },
    update: {
        'en': 'Update',
        'zh-TW': '更新',
    },
    view: {
        'en': 'View',
        'zh-TW': '查看',
    },
} as const satisfies Record<string, LocalizedMessages>;
