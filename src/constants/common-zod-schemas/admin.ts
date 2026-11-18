import { AdminModel } from '@kcs-project/pack/models/admin';

export const existingId = z.objectId().refine(
    (_id) => AdminModel.exists({ _id }),
    z.i18nIssue({
        'en': 'The admin does not exist',
        'zh-TW': '管理員不存在',
    }),
);
