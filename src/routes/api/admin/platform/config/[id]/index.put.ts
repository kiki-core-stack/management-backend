import { clearPlatformConfigCache } from '@kcs-project/pack/libs/platform/config';
import { PlatformConfigModel } from '@kcs-project/pack/models/platform/config';
import { platformConfigVariants } from '@kcs-project/pack/schemas/platform';

export const jsonSchema = z.object({ config: z.object({}).catchall(z.any()) });
export default defineRoute({ permission: adminPermissions.platform.config.update })(
    apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
    async (ctx) => {
        const platformConfig = await PlatformConfigModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        const config = await platformConfigVariants.parse(platformConfig.scope, data.config);
        await platformConfig.assertUpdateIfNotModified(
            updatedAt,
            {
                $set: {
                    config,
                    editedByAdmin: ctx.adminId,
                },
            },
        );

        await clearPlatformConfigCache(platformConfig.scope).catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
