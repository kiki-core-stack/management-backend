import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export const routePermission = 'admin sms.provider.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        SmsProviderModel,
        undefined,
        {
            populate: populateCreatedAndEditedByAdminOptions,
            sort: { priority: -1 },
        },
    );
});
