import { EmailSendRecordModel } from '@kiki-core-stack/pack/models/email/send-record';

export const routePermission = 'admin email.sendRecord.list';

export default defineRouteHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        EmailSendRecordModel,
        undefined,
        {
            populate: {
                path: 'platform',
                select: [
                    'name',
                    'serviceProvider',
                ],
            },
        },
    );
});
