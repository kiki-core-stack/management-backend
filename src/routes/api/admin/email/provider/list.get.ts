import { EmailProviderModel } from '@kiki-core-stack/pack/models/email/provider';

export const routePermission = 'admin email.provider.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        EmailProviderModel,
        undefined,
        {
            populate: populateCreatedAndEditedByAdminOptions,
            sort: { priority: -1 },
        },
    );
});
