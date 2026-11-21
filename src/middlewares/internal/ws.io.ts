import { Buffer } from 'node:buffer';
import { timingSafeEqual } from 'node:crypto';

const introspectionToken = getRequiredEnv('WS_IO_INTROSPECTION_TOKEN');
if (Buffer.byteLength(introspectionToken) < 32) {
    throw new TypeError('WS_IO_INTROSPECTION_TOKEN must contain at least 32 bytes');
}

const introspectionTokenBytes = Buffer.from(introspectionToken);

useRouteMiddleware(
    '/api/internal/ws-io/*',
    async (ctx, _route, next) => {
        ctx.header('cache-control', 'no-store');

        const providedToken = Buffer.from(ctx.req.header('x-ws-io-introspection-token') ?? '');
        if (
            providedToken.byteLength !== introspectionTokenBytes.byteLength
            || !timingSafeEqual(providedToken, introspectionTokenBytes)
        ) throwApiError(apiErrors.common.unauthorized);

        await next();
    },
);
