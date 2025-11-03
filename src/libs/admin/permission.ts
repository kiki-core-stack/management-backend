import { redisClient } from '@kiki-core-stack/pack/constants/redis';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminRoleDocument } from '@kiki-core-stack/pack/models/admin/role';
import { toObjectIdHexString } from '@kikiutils/mongoose/helpers';
import type { Types } from 'mongoose';

export async function clearAllAdminPermissionCache() {
    await redisClient.del(...await redisClient.keys('adminPermission:*'));
}

export async function getAdminPermission(adminId: string | Types.ObjectId) {
    let adminPermission = await redisStore.adminPermission.getItem(toObjectIdHexString(adminId));
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

        await redisStore.adminPermission.setItem(adminPermission, toObjectIdHexString(adminId));
    }

    return adminPermission;
}
