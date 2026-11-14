import type { LocalizedMessages } from '@kcs-project/pack/types/i18n';
import type { Context } from 'hono';

/**
 * Throws `validationFailed` for one field, like a schema issue at `path`, for checks that need data beyond the input
 * (e.g. the stored password).
 */
export function throwFieldValidationError(
    ctx: Context,
    path: Array<number | string>,
    message: LocalizedMessages,
): never {
    throwApiError(
        apiErrors.common.validationFailed,
        {
            errorData: {
                issues: [
                    {
                        code: 'custom',
                        message: message[ctx.var.locale],
                        path,
                    },
                ],
            },
        },
    );
}
