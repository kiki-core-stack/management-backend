import { AdminModel } from '@kcs-project/pack/models/admin';
import type { AdminDocument } from '@kcs-project/pack/models/admin';
import { Context } from 'hono';

declare module 'hono' {
    interface Context {
        getAdmin: () => Promise<AdminDocument>;
    }
}

Context.prototype.getAdmin = async function () {
    const admin = await AdminModel.findById(this.adminId);
    if (!admin) throwApiError(apiErrors.auth.sessionInvalid);
    return admin;
};
