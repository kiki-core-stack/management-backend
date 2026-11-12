import { clearPlatformConfigCache } from '@kcs-project/pack/libs/platform/config';
import { PlatformConfigModel } from '@kcs-project/pack/models/platform/config';
import { parsePlatformConfig } from '@kcs-project/pack/schemas/platform';

export const jsonSchema = z.object({ config: z.object({}).catchall(z.any()) });
export default defineRoute({ permission: adminPermissions.platform.config.update })(
    apiValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const platformConfig = await PlatformConfigModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), platformConfig);
        const config = await parsePlatformConfig(platformConfig.scope, data.config);
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
