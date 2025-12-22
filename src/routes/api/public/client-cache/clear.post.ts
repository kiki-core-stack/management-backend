export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defineRouteHandlers((ctx) => {
    ctx.header('clear-site-data', '"cache", "clienthints", "executionContexts", "prefetchCache", "prerenderCache"');
    return ctx.createApiSuccessResponse();
});
