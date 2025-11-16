import { EmailSenderIdentityModel } from '@kiki-core-stack/pack/models/email/sender-identity';

export const routePermission = 'admin email.senderIdentity.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        EmailSenderIdentityModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    );
});
