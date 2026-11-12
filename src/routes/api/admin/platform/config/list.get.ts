import { PlatformConfigModel } from '@kcs-project/pack/models/platform/config';

export default defineRoute({ permission: adminPermissions.platform.config.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        PlatformConfigModel,
        undefined,
        {
            populate: populateCreatedAndEditedByAdminOptions,
            sort: { scope: 1 },
        },
    ),
);
