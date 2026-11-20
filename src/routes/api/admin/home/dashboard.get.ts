export const querySchema = z.object({
    endAt: z.coerce.date(),
    startAt: z.coerce.date(),
});

export default defineRoute({ permission: adminPermissions.home.dashboard.view })(
    apiValidator('query', querySchema),
    (ctx) => ctx.createApiSuccessResponse({}),
);
