import type {
    BaseMongoosePaginateModel,
    MongooseHydratedDocument,
} from '@kikiutils/mongoose/types';
import type { PaginateOptions } from '@kikiutils/mongoose/types/paginate';
import type { Context } from 'hono';
import {
    objectEntries,
    objectKeys,
} from 'ts-extras';

import type { GetListQuery } from '@/globals/libs/get-list-query';

// The request's sort, else the route's default, always ending with `_id` so pages stay stable.
function buildSort(sort: GetListQuery['sort'], defaultSort: PaginateOptions['sort']) {
    const rawSort = objectKeys(sort).length ? sort : defaultSort;
    if (rawSort === undefined) return { _id: -1 };
    if (typeof rawSort === 'object') {
        return {
            ...rawSort,
            _id: -1,
        };
    }

    return /\b-?_id\b/.test(rawSort) ? rawSort : `${rawSort.trim()} -_id`;
}

/**
 * Paginates the model by the request's list query (parsed here unless given). When `fields` is requested, only the
 * populates of the requested paths (and of their sub-paths) are kept.
 */
export async function paginateModelData<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>(
    ctx: Context,
    model: BaseMongoosePaginateModel<RawDocType, QueryHelpers, InstanceMethodsAndOverrides>,
    query?: GetListQuery,
    paginateOptions?: PaginateOptions,
) {
    query ??= parseGetListQuery(ctx, model);
    const fields = [...query.fields];
    let populate = paginateOptions?.populate;
    if (populate && fields.length) {
        const requestedPaths = fields.filter((field) => !field.startsWith('-'));
        populate = (Array.isArray(populate) ? populate : [populate]).filter((option) => {
            const path = typeof option === 'object' ? option.path : option;
            return requestedPaths.some((field) => path === field || path.startsWith(`${field}.`));
        }) as typeof populate;
    }

    if (paginateOptions?.select) {
        if (Array.isArray(paginateOptions.select)) fields.push(...paginateOptions.select);
        else if (typeof paginateOptions.select === 'string') {
            fields.push(...paginateOptions.select.split(/\s+/).filter(Boolean));
        } else {
            objectEntries(paginateOptions.select).forEach(([key, value]) => fields.push(value ? key : `-${key}`));
        }
    }

    // A projection cannot mix inclusions and exclusions; with any inclusion, keep only the included paths.
    let select = fields;
    if (fields.some((field) => field.startsWith('-'))) {
        const includedFields = fields.filter((field) => !field.startsWith('-') && !fields.includes(`-${field}`));
        if (includedFields.length) select = includedFields;
    }

    const paginatedResult = await model.paginate(
        query.filter,
        {
            ...paginateOptions,
            limit: query.limit,
            page: query.page,
            populate,
            select,
            sort: buildSort(query.sort, paginateOptions?.sort),
        },
    );

    return {
        count: paginatedResult.totalDocs,
        list: paginatedResult.docs as Array<
            MongooseHydratedDocument<RawDocType, InstanceMethodsAndOverrides, QueryHelpers>
        >,
    };
}
