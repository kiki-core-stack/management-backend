export const routePermission = 'admin home.dashboard.view';

export default defineRouteHandlers((ctx) => {
    const parsedApiRequestQueryParams = parseApiRequestQueryParams(ctx);
    return ctx.createApiSuccessResponse(parsedApiRequestQueryParams);
});
