import { EmailSenderIdentityModel } from '@kcs-project/pack/models/email/sender-identity';

export default defineRoute({ permission: adminPermissions.email.senderIdentity.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        EmailSenderIdentityModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    ),
);
