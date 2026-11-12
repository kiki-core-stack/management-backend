import { EmailSendRecordModel } from '@kcs-project/pack/models/email/send-record';

export default defineRoute({ permission: adminPermissions.email.sendRecord.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        EmailSendRecordModel,
        undefined,
        {
            populate: {
                path: 'provider',
                select: [
                    'code',
                    'name',
                ],
            },
        },
    ),
);
