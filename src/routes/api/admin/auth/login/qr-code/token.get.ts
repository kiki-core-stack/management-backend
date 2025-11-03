import { nanoid } from 'nanoid';

const querySchema = z.object({ oldToken: z.string().trim().min(1).optional() });
export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('query', querySchema),
    async (ctx) => {
        const { oldToken } = ctx.req.valid('query');
        if (oldToken) await redisStore.adminQrCodeLoginData.removeItem(oldToken);
        const token = generateWithNestedRandomLength(nanoid, 96, 128, 160, 192);
        await redisStore.adminQrCodeLoginData.setItemWithTtl(
            60,
            {
                ip: getClientIpFromXForwardedFor(ctx)!,
                status: 'pending',
                userAgent: ctx.req.header('user-agent'),
            },
            token,
        );

        return ctx.createApiSuccessResponse({ token });
    },
);
