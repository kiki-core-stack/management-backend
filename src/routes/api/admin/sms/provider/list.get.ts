import { SmsProviderModel } from '@kcs-project/pack/models/sms/provider';

export const routePermission = 'admin sms.provider.list';

export default defineRouteHandlers(async (ctx) => await paginateModelDataWithApiResponse(
    ctx,
    SmsProviderModel,
    undefined,
    {
        populate: populateCreatedAndEditedByAdminOptions,
        sort: { priority: -1 },
    },
));
