import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { handleAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({ token: z.string().trim().min(1) });
export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const { token } = ctx.req.valid('json');
        const pollingStartAt = Date.now();
        while (Date.now() - pollingStartAt < 20000) {
            if (ctx.req.raw.signal.aborted) return ctx.createApiSuccessResponse();
            const adminQrCodeLoginData = await redisStore.adminQrCodeLoginData.getItem(token);
            if (!adminQrCodeLoginData) throwApiError(410);
            if (adminQrCodeLoginData.adminId) {
                const admin = await AdminModel.findOne({
                    _id: adminQrCodeLoginData.adminId,
                    enabled: true,
                });

                if (!admin) throwApiError(410);
                await handleAdminLogin(ctx, admin._id, 'QR Code 登入');
                redisStore.adminQrCodeLoginData.removeItem(token).catch(() => {});
                return ctx.createApiSuccessResponse({ status: 'success' });
            }

            await Bun.sleep(500);
        }

        return ctx.createApiSuccessResponse({ status: 'pending' });
    },
);
