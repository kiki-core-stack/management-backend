import { AdminModel } from '@kcs-project/pack/models/admin';

export const existingId = z.objectId().refine(
    async (_id) => !!await AdminModel.exists({ _id }),
    z.i18nIssue(appLocaleCatalogs, (messages) => messages.validation.admin.notFound),
);
