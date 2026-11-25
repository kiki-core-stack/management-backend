import type { BaseMongoosePaginateModel } from '@kikiutils/mongoose/types';
import type { PaginateOptions } from '@kikiutils/mongoose/types/paginate';
import type { Context } from 'hono';

import type { GetListQuery } from '@/globals/libs/get-list-query';

export async function paginateModelDataWithApiResponse<Model extends BaseMongoosePaginateModel<any, any, any>>(
    ctx: Context,
    model: Model,
    query?: GetListQuery,
    paginateOptions?: PaginateOptions,
) {
    return ctx.createApiSuccessResponse(await paginateModelData(ctx, model, query, paginateOptions));
}
