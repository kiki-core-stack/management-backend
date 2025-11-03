import { baseSetCookieOptions } from '@kiki-core-stack/pack/hono-backend/constants/cookie';
import { getManagementTypeFromRoutePath } from '@kiki-core-stack/pack/libs/management';
import type { ManagementType } from '@kiki-core-stack/pack/types';
import type { Context } from 'hono';
import {
    deleteCookie,
    getCookie,
    setCookie,
} from 'hono/cookie';

export function deleteAuthToken(ctx: Context, managementType?: ManagementType) {
    return deleteCookie(ctx, resolveAuthTokenName(ctx, managementType));
}

export function getAuthToken(ctx: Context, managementType?: ManagementType) {
    return getCookie(ctx, resolveAuthTokenName(ctx, managementType));
}

function resolveAuthTokenName(ctx: Context, managementType?: ManagementType) {
    managementType ??= getManagementTypeFromRoutePath(ctx.req.path);
    if (!managementType) throw new Error('No management type found');
    return `${managementType}-token`;
}

export function setAuthToken(ctx: Context, token: string, managementType?: ManagementType) {
    setCookie(
        ctx,
        resolveAuthTokenName(ctx, managementType),
        token,
        {
            ...baseSetCookieOptions,
            maxAge: 86400 * 7,
        },
    );
}
