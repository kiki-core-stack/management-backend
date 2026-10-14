import { clearPlatformConfigCache } from '@kcs-project/pack/libs/platform/config';
import { PlatformConfigModel } from '@kcs-project/pack/models/platform/config';
import { platformConfigValidators } from '@kcs-project/pack/schemas/platform/config';

export const jsonSchema = z.object({ config: z.object({}).catchall(z.any()) });
export const routePermission = 'admin platform.config.update';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const platformConfig = await PlatformConfigModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), platformConfig);
        const config = platformConfigValidators[platformConfig.scope].parse(data.config);
        await platformConfig.assertUpdateSuccess({
            $set: {
                config,
                editedByAdmin: ctx.adminId,
            },
        });

        await clearPlatformConfigCache(platformConfig.scope).catch(logger.error);
        return ctx.createApiSuccessResponse();
    },
);
