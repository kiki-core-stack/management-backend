import { EmailProviderModel } from '@kcs-project/pack/models/email/provider';

export default defineRoute({ permission: adminPermissions.email.provider.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        EmailProviderModel,
        undefined,
        {
            populate: populateCreatedAndEditedByAdminOptions,
            sort: { priority: -1 },
        },
    ),
);
