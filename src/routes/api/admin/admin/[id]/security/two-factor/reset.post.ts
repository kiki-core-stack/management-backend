import { adminAuthManagementRoutes } from '@/constants/admin/auth';
import { defineAdminAuthManagementRoute } from '@/libs/admin/auth';

export default defineAdminAuthManagementRoute(adminAuthManagementRoutes.resetTwoFactor);
