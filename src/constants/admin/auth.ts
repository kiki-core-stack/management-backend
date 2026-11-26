import { PlatformScope } from '@kcs-project/pack/constants/platform';
import { createHonoAuth } from '@kcs-project/pack/hono-backend/libs/auth';
import { defineAuthRealm } from '@kcs-project/pack/libs/auth/realm';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { AdminDocument } from '@kcs-project/pack/models/admin';

import { findManageableAdminOrThrow } from '@/libs/admin/auth';

// Constants
export const adminAuthRealm = defineAuthRealm<AdminDocument>({
    cookieName: '__Host-admin-session',
    displayName: 'kcs總後台',
    findPrincipalByIdentifier: async (account) => await AdminModel.findOne({ account }),
    getPrincipalDisplayName: (admin) => admin.account,
    isPrincipalActive: (admin) => admin.enabled,
    model: AdminModel,
    name: 'admin',
    // The ws.io server closes the connections bound to the revoked sessions.
    onSessionsRevoked: (principalId, sessionIds) => {
        wsIoClient.emit(WsIoEventNames.ToServer.AuthSessionsRevoked, adminAuthRealm.name, principalId, sessionIds);
    },
    origin: getRequiredEnv('ADMIN_AUTH_ORIGIN'),
    scope: PlatformScope.AdminManagement,
    webauthn: true,
});

export const adminAuth = createHonoAuth(adminAuthRealm, { getClientIp });

export const adminAuthManagementRoutes = adminAuth.createManagementRoutes({
    assertActorVerification: adminAuth.assertVerification,
    getActor: (ctx) => ({
        principalId: ctx.adminId!.toHexString(),
        realm: adminAuthRealm.name,
    }),
    getTargetPrincipalId: async (ctx) => (await findManageableAdminOrThrow(ctx)).id,
});
