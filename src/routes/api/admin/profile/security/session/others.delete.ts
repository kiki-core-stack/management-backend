import { adminAuth } from '@/constants/admin/auth';
import { defineAdminAuthRoute } from '@/libs/admin/auth';

export default defineAdminAuthRoute(adminAuth.routes.security.revokeOtherSessions);
