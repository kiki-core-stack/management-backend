import { EmailPlatformModel } from '@kiki-core-stack/pack/models/email/platform';

export const routePermission = 'admin email.platform.toggle';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(ctx, EmailPlatformModel, ['enabled']);
    return ctx.createApiSuccessResponse();
});
