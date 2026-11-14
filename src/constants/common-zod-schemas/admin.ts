import { AdminModel } from '@kcs-project/pack/models/admin';
import { AdminRoleModel } from '@kcs-project/pack/models/admin/role';

export const existingId = z.objectId().refine(
    (_id) => AdminModel.exists({ _id }),
    z.i18nIssue({
        'en': 'The admin does not exist',
        'zh-TW': '管理員不存在',
    }),
);

export const existingRoleId = z.objectId().refine(
    (_id) => AdminRoleModel.exists({ _id }),
    z.i18nIssue({
        'en': 'The role does not exist',
        'zh-TW': '身分組不存在',
    }),
);
