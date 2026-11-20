import { isPrimitive } from 'es-toolkit';
import type { Context } from 'hono';
import type {
    Model,
    QueryFilter,
} from 'mongoose';
import {
    objectEntries,
    objectKeys,
} from 'ts-extras';
import type { UnknownRecord } from 'type-fest';

type AnyModel = Model<any, any, any, any, any, any, any>;

export interface GetListQuery {
    /**
     * Requested paths; excluded ones are prefixed with `-`.
     */
    fields: string[];
    /**
     * Cast to the model's schema, so it also works in `aggregate` and `distinct`.
     */
    filter: Record<string, any>;
    limit: number;
    page: number;
    skip: number;
    sort: Record<string, -1 | 1>;
}

export interface ParseGetListQueryOptions {
    /**
     * Conditions always applied, combined with the request's filter by `$and`.
     */
    scope?: QueryFilter<any>;
}

// Constants/Variables
const comparisonOperators = new Set([
    '$eq',
    '$gt',
    '$gte',
    '$in',
    '$lt',
    '$lte',
    '$ne',
    '$nin',
]);

const maxArrayLength = 100;
const maxLimit = 1000;
const maxLogicalDepth = 2;
const maxSortFields = 5;
// Text operators, matched literally: the text is escaped and anchored into `$regex`.
const textOperatorToPattern: Record<string, (escapedText: string) => string> = {
    $contains: (escapedText) => escapedText,
    $endsWith: (escapedText) => `${escapedText}$`,
    $startsWith: (escapedText) => `^${escapedText}`,
};

// Functions
const badRequest = (): never => throwApiError(apiErrors.common.badRequest);

function isPrivatePath(model: AnyModel, path: string) {
    return !!model.schema.path(path)?.options?.private;
}

function isSelectablePath(model: AnyModel, path: string) {
    const pathType = model.schema.pathType(path);
    return (pathType === 'real' || pathType === 'nested') && !isPrivatePath(model, path);
}

function normalizeCondition(condition: unknown) {
    if (isPrimitive(condition)) return condition;
    if (!isPlainObject(condition) || !objectKeys(condition).length) return badRequest();
    const normalizedCondition: UnknownRecord = {};
    for (const [operator, operand] of objectEntries(condition)) {
        const toPattern = textOperatorToPattern[operator];
        if (toPattern) {
            if (typeof operand !== 'string' || !operand || normalizedCondition.$regex) badRequest();
            normalizedCondition.$regex = toPattern(escapeRegExp(operand as string));
        } else if (operator === '$exists' || operator === '$ignoreCase') {
            if (typeof operand !== 'boolean') badRequest();
            if (operator === '$exists') normalizedCondition.$exists = operand;
            else if (operand) normalizedCondition.$options = 'i';
        } else if (operator === '$in' || operator === '$nin') {
            if (!Array.isArray(operand) || operand.length > maxArrayLength || !operand.every(isPrimitive)) badRequest();
            normalizedCondition[operator] = operand;
        } else if (comparisonOperators.has(operator) && isPrimitive(operand)) {
            normalizedCondition[operator] = operand;
        } else badRequest();
    }

    // `$ignoreCase` only modifies a text operator.
    if (normalizedCondition.$options && !normalizedCondition.$regex) badRequest();
    return normalizedCondition;
}

function normalizeFilter(model: AnyModel, filter: unknown, depth: number) {
    if (!isPlainObject(filter)) return badRequest();
    const normalizedFilter: UnknownRecord = {};
    for (const [key, value] of objectEntries(filter)) {
        if (key === '$and' || key === '$or') {
            if (depth >= maxLogicalDepth || !Array.isArray(value) || !value.length || value.length > maxArrayLength) {
                badRequest();
            }

            normalizedFilter[key] = (value as unknown[]).map((item) => normalizeFilter(model, item, depth + 1));
        } else if (key.startsWith('$') || isPrivatePath(model, key)) badRequest();
        else normalizedFilter[key] = normalizeCondition(value);
    }

    return normalizedFilter;
}

/**
 * Parses `filter` (JSON), `fields`, `sort`, `page` and `limit` of a list request against the model's schema; anything
 * invalid throws `badRequest`.
 *
 * Only plain field conditions, `$and` / `$or` and the operators handled by `normalizeCondition` (admin-frontend's
 * `GetListFilterOperators`) are accepted; paths must be in the schema and not `private`. Values are cast by mongoose,
 * so ids and dates can be sent as strings.
 */
export function parseGetListQuery(ctx: Context, model: AnyModel, options?: ParseGetListQueryOptions): GetListQuery {
    const queries = ctx.req.queries();
    const page = parsePositiveInteger(queries.page?.[0], 1);
    const limit = parsePositiveInteger(queries.limit?.[0], 10);
    if (limit > maxLimit) badRequest();
    const fields = [...new Set(queries.fields ?? [])];
    for (const field of fields) {
        const path = field.startsWith('-') ? field.slice(1) : field;
        if (!isSelectablePath(model, path)) badRequest();
    }

    const sort: Record<string, -1 | 1> = {};
    const sortFields = queries.sort?.[0]?.split(',').filter(Boolean) ?? [];
    if (sortFields.length > maxSortFields) badRequest();
    for (const field of sortFields) {
        const path = field.startsWith('-') ? field.slice(1) : field;
        if (model.schema.pathType(path) !== 'real' || isPrivatePath(model, path)) badRequest();
        sort[path] = field.startsWith('-') ? -1 : 1;
    }

    let filter: Record<string, any> = {};
    if (queries.filter?.[0]) {
        try {
            filter = JSON.parse(queries.filter[0]);
        } catch {
            badRequest();
        }

        filter = normalizeFilter(model, filter, 0);
    }

    if (options?.scope) {
        filter = objectKeys(filter).length
            ? {
                $and: [
                    options.scope,
                    filter,
                ],
            }
            : options.scope;
    }

    try {
        filter = model.find().setOptions({ strictQuery: 'throw' }).cast(model, filter);
    } catch {
        badRequest();
    }

    return {
        fields,
        filter,
        limit,
        page,
        skip: (page - 1) * limit,
        sort,
    };
}

function parsePositiveInteger(value: string | undefined, defaultValue: number) {
    if (value === undefined) return defaultValue;
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : badRequest();
}
