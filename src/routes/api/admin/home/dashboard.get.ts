export default defineRoute({ permission: adminPermissions.home.dashboard.view })((ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    return ctx.createApiSuccessResponse(parsedApiRequestQueryParams);
});
