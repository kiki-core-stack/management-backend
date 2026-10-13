import { PlatformConfigModel } from '@kcs-project/pack/models/platform/config';

export const routePermission = 'admin platform.config.list';

export default defineRouteHandlers((ctx) => paginateModelDataWithApiResponse(
    ctx,
    PlatformConfigModel,
    undefined,
    {
        populate: populateCreatedAndEditedByAdminOptions,
        sort: { scope: 1 },
    },
));
