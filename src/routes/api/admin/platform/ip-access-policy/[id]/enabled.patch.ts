import { clearPlatformIpAccessPolicyCache } from '@kcs-project/pack/libs/platform/ip-access-policy';
import { PlatformIpAccessPolicyModel } from '@kcs-project/pack/models/platform/ip-access-policy';

export default defineRoute({ permission: adminPermissions.platform.ipAccessPolicy.toggle })(
    apiValidator('json', z.object({ enabled: z.boolean() })),
    async (ctx) => {
        const platformIpAccessPolicy = await PlatformIpAccessPolicyModel.findByRouteIdOrThrowNotFoundError(ctx);
        await platformIpAccessPolicy.assertUpdateSuccess({
            $set: {
                ...ctx.req.valid('json'),
                editedByAdmin: ctx.adminId,
            },
        });

        await clearPlatformIpAccessPolicyCache().catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
