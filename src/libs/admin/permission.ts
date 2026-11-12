import { redisClient } from '@kcs-project/pack/connections/redis';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { AdminRoleDocument } from '@kcs-project/pack/models/admin/role';
import type { PrincipalPermissions } from '@kcs-project/pack/types/permission';
import type { Types } from 'mongoose';

export async function clearAllAdminPermissionCache() {
    const keys = await redisClient.keys(redisStore.admin.permission.resolveKey('*'));
    if (keys.length) await redisClient.del(...keys);
}

export async function getAdminPermission(adminId: Types.ObjectId): Promise<PrincipalPermissions> {
    let adminPermission = await redisStore.admin.permission.getItem(adminId);
    if (!adminPermission) {
        const admin = await AdminModel
            .findById(adminId)
            .select([
                '-_id',
                'isSuperAdmin',
                'roles',
            ]);

        if (!admin) throw new Error('Admin not found');
        if (admin.isSuperAdmin) {
            adminPermission = {
                permissions: [],
                unrestricted: true,
            };
        } else {
            const populatedAdmin = await admin.populate<{ roles: AdminRoleDocument[] }>(
                'roles',
                [
                    '-_id',
                    'permissions',
                ],
            );

            adminPermission = {
                permissions: [...new Set(populatedAdmin.roles.map((role) => role.permissions).flat())],
                unrestricted: false,
            };
        }

        await redisStore.admin.permission.setItemWithTtl(60, adminPermission, adminId);
    }

    return adminPermission;
}
