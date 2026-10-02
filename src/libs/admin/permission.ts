import { redisClient } from '@kcs-project/pack/constants/redis';
import { AdminModel } from '@kcs-project/pack/models/admin';
import type { AdminRoleDocument } from '@kcs-project/pack/models/admin/role';
import { toObjectIdHexString } from '@kikiutils/mongoose/helpers';
import type { Types } from 'mongoose';

export async function clearAllAdminPermissionCache() {
    const keys = await redisClient.keys(redisStore.admin.permission.resolveKey('*'));
    if (keys.length) await redisClient.del(...keys);
}

export async function getAdminPermission(adminId: Types.ObjectId) {
    let adminPermission = await redisStore.admin.permission.getItem(toObjectIdHexString(adminId));
    if (!adminPermission) {
        const admin = await AdminModel
            .findById(adminId)
            .select([
                '-_id',
                'isSuperAdmin',
                'roles',
            ]);

        if (!admin) throw new Error('Admin not found');
        if (admin?.isSuperAdmin) {
            adminPermission = {
                isSuperAdmin: true,
                permissions: [],
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
                isSuperAdmin: false,
                permissions: [...new Set(populatedAdmin.roles.map((role) => role.permissions).flat())],
            };
        }

        await redisStore.admin.permission.setItem(adminPermission, toObjectIdHexString(adminId));
    }

    return adminPermission;
}
