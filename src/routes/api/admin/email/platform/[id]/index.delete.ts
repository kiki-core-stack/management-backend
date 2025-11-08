import { EmailPlatformModel } from '@kiki-core-stack/pack/models/email/platform';
import { EmailSendRecordModel } from '@kiki-core-stack/pack/models/email/send-record';

export const routePermission = 'admin email.platform.delete';

export default defineRouteHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        EmailPlatformModel,
        undefined,
        undefined,
        async (emailPlatform) => {
            if (await EmailSendRecordModel.exists({ platform: emailPlatform })) throwApiError(409);
        },
    );

    return ctx.createApiSuccessResponse();
});
