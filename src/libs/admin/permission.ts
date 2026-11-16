import { VersionedCache } from '@kcs-project/pack/libs/redis/versioned-cache';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { AdminRoleDocument } from '@kcs-project/pack/models/admin/role';
import type { PrincipalPermissions } from '@kcs-project/pack/types/permission';
import type { Types } from 'mongoose';

// Constants/Variables
const adminPermissionCache = new VersionedCache({
    key: (adminId: string | Types.ObjectId) => adminId.toString(),
    load: getUncachedAdminPermission,
    name: 'admin:permission',
    redisTtlSeconds: 60,
});

// Functions
export async function clearAdminPermissionCache(adminId: string | Types.ObjectId) {
    await adminPermissionCache.invalidate(adminId);
}

export async function clearAllAdminPermissionCache() {
    await adminPermissionCache.invalidateAll();
}

export async function getAdminPermission(adminId: Types.ObjectId) {
    return await adminPermissionCache.get(adminId);
}

async function getUncachedAdminPermission(adminId: string | Types.ObjectId): Promise<PrincipalPermissions> {
    const admin = await AdminModel
        .findById(adminId)
        .select([
            '-_id',
            'isSuperAdmin',
            'roles',
        ]);

    if (!admin) throw new Error('Admin not found');
    if (admin.isSuperAdmin) {
        return {
            permissions: [],
            unrestricted: true,
        };
    }

    const populatedAdmin = await admin.populate<{ roles: AdminRoleDocument[] }>(
        'roles',
        [
            '-_id',
            'permissions',
        ],
    );

    return {
        permissions: [...new Set(populatedAdmin.roles.map((role) => role.permissions).flat())],
        unrestricted: false,
    };
}
