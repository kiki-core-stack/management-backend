import { SmsSendRecordModel } from '@kcs-project/pack/models/sms/send-record';

export default defineRoute({ permission: adminPermissions.sms.sendRecord.list })(
    async (ctx) => await paginateModelDataWithApiResponse(
        ctx,
        SmsSendRecordModel,
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
