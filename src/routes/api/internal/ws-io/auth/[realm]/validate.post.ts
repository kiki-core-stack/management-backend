import { authenticateAuthConnection } from '@kcs-project/pack/libs/auth/access';
import { getAuthRealm } from '@kcs-project/pack/libs/auth/realm';

const jsonSchema = z.object({
    ip: z.union([
        z.ipv4(),
        z.ipv6(),
    ]),
    token: z.string().min(1),
});

/**
 * Validates the session token of a ws.io connection, at the handshake and periodically while it stays open.
 */
export default defineRoute({
    noLoginRequired: true,
    permission: 'ignore',
})(
    apiValidator('param', z.object({ realm: z.string().min(1) })),
    apiValidator('json', jsonSchema),
    async (ctx) => {
        const realm = getAuthRealm(ctx.req.valid('param').realm);
        if (!realm) throwApiError(apiErrors.common.notFound);
        const { ip, token } = ctx.req.valid('json');
        const session = await authenticateAuthConnection(realm, token, { ip });
        if (!session) throwApiError(apiErrors.common.unauthorized);
        return ctx.createApiSuccessResponse({
            principalId: session.principalId,
            sessionId: session.id,
        });
    },
);
