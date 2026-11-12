import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        PlatformIpAccessPolicyModel,
        undefined,
        {
            populate: [
                ...populateCreatedAndEditedByAdminOptions,
                {
                    path: 'targets.principalIds',
                    select: ['account'],
                },
            ],
        },
    ),
);
