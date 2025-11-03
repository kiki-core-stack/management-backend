const paramsSchema = z.object({ token: z.string().trim().min(1) });
export const routePermission = 'ignore';

export default defineRouteHandlers(
    apiZValidator('param', paramsSchema),
    async (ctx) => {
        const { token } = ctx.req.valid('param');
        const adminQrCodeLoginData = await redisStore.adminQrCodeLoginData.getItem(token);
        if (adminQrCodeLoginData?.status !== 'pending') throwApiError(410);
        await redisStore.adminQrCodeLoginData.setItemWithTtl(
            2,
            {
                ...adminQrCodeLoginData,
                adminId: ctx.adminId!.toHexString(),
                status: 'approved',
            },
            token,
        );

        return ctx.createApiSuccessResponse();
    },
);
