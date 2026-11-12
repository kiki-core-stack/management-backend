export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})((ctx) => {
    ctx.header('clear-site-data', '"cache", "clienthints", "executionContexts", "prefetchCache", "prerenderCache"');
    return ctx.createApiSuccessResponse();
});
