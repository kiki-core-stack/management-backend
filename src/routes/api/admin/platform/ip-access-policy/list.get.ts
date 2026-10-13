import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export const routePermission = 'admin platform.ipAccessPolicy.list';

export default defineRouteHandlers((ctx) => paginateModelDataWithApiResponse(
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
));
