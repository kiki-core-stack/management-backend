import { EmailSendRecordModel } from '@kcs-project/pack/models/email/send-record';

export const routePermission = 'admin email.sendRecord.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        EmailSendRecordModel,
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
