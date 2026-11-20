import { getPublicFileKey } from '@kcs-project/pack/libs/file';
import { FileModel } from '@kcs-project/pack/models/file';

// The gateway serves the public bucket at /files/<key>; files never change, so browsers may cache the redirect.
export default defineRoute({ permission: 'ignore' })(async (ctx) => {
    const file = await FileModel.findByRouteIdOrThrowNotFoundError(ctx);
    return ctx.redirect(`/${getPublicFileKey(file)}`, 301);
});
