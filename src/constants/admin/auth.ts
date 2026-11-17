import { PlatformScope } from '@kcs-project/pack/constants/platform';
import { createHonoAuth } from '@kcs-project/pack/hono-backend/libs/auth';
import { defineAuthRealm } from '@kcs-project/pack/libs/auth/realm';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kcs-project/pack/models/admin';
import type { QueryFilter } from 'mongoose';

import { getAdminPermission } from '@/libs/admin/permission';

// Constants
export const adminAuthRealm = defineAuthRealm<AdminDocument>({
    cookieName: '__Host-admin-session',
    displayName: 'Kiki Core Stack Admin',
    findPrincipalByIdentifier: async (account) => await AdminModel.findOne({ account }),
    getPrincipalDisplayName: (admin) => admin.account,
    isPrincipalActive: (admin) => admin.enabled,
    model: AdminModel,
    name: 'admin',
    origins: checkAndGetEnvValue('ADMIN_AUTH_ORIGINS'),
    scope: PlatformScope.AdminManagement,
    webauthn: {},
});

export const adminAuth = createHonoAuth(adminAuthRealm, { getClientIp });

/**
 * Routes for admins managing admins' security, their own included; only unrestricted admins may manage super admins.
 */
export const adminAuthManagementRoutes = adminAuth.createManagementRoutes({
    assertActorVerification: adminAuth.assertVerification,
    getActor: (ctx) => ({
        principalId: ctx.adminId!.toHexString(),
        realm: adminAuthRealm.name,
    }),
    async getTargetPrincipalId(ctx) {
        const filter: QueryFilter<Admin> = {};
        if (!(await getAdminPermission(ctx.adminId!)).unrestricted) filter.isSuperAdmin = false;
        return (await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, filter)).id;
    },
});
