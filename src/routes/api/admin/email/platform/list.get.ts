import { EmailPlatformModel } from '@kiki-core-stack/pack/models/email/platform';

export const routePermission = 'admin email.platform.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        EmailPlatformModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    );
});
