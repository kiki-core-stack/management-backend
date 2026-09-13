import { SmsSendRecordModel } from '@kcs-project/pack/models/sms/send-record';

export const routePermission = 'admin sms.sendRecord.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        SmsSendRecordModel,
        undefined,
        {
            populate: {
                path: 'provider',
                select: [
                    'name',
                    'providerCode',
                ],
            },
        },
    );
});
