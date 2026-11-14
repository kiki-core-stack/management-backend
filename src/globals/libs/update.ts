import { objectKeys } from 'ts-extras';

/**
 * Input field for updates checked against concurrent changes: the `updatedAt` the client read, passed to
 * `document.assertUpdateIfNotModified` (pack) so a stale update is rejected with `conflict`.
 */
export const notModifiedInputShape = { updatedAt: z.strictIsoDateString() };

/**
 * Update query that sets the defined fields of `data` and unsets the listed optional fields left absent (e.g. a cleared
 * optional input), so clearing a field removes it instead of keeping the old value.
 */
export function buildUpdateQuery<T extends object>(data: T, unsetFieldsWhenAbsent: ReadonlyArray<keyof T> = []) {
    const $set: Partial<T> = {};
    for (const field in data) {
        if (data[field] !== undefined) $set[field] = data[field];
    }

    const $unset: Partial<Record<keyof T, true>> = {};
    for (const field of unsetFieldsWhenAbsent) {
        if (data[field] === undefined) $unset[field] = true;
    }

    return {
        $set,
        ...objectKeys($unset).length ? { $unset } : {},
    };
}
