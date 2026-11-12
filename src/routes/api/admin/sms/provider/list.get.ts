import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export default defineRoute({ permission: adminPermissions.sms.provider.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        SmsProviderModel,
        undefined,
        {
            populate: populateCreatedAndEditedByAdminOptions,
            sort: { priority: -1 },
        },
    ),
);
