import { getPublicFilePath } from '@kcs-project/pack/libs/file';
import { FileModel } from '@kcs-project/pack/models/file';

// Files never change, so browsers may cache the redirect.
export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    const file = await FileModel.findByRouteIdOrThrowNotFoundError(ctx);
    return ctx.redirect(getPublicFilePath(file), 301);
});
