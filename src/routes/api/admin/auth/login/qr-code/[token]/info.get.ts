const paramsSchema = z.object({ token: z.string().trim().min(1) });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('param', paramsSchema),
    async (ctx) => {
        const adminQrCodeLoginData = await redisStore.adminQrCodeLoginData.getItem(ctx.req.valid('param').token);
        if (adminQrCodeLoginData?.status !== 'pending') throwApiError(410);
        return ctx.createApiSuccessResponse(
            pick(
                adminQrCodeLoginData,
                [
                    'ip',
                    'userAgent',
                ],
            ),
        );
    },
);
