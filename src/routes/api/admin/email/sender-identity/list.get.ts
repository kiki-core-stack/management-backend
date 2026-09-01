import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

export const routePermission = 'admin email.senderIdentity.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        EmailSenderIdentityModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    );
});
