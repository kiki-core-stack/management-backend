import type { PermissionGroupNode } from '@kcs-project/pack/types/permission';

export const home = { children: { dashboard: { children: { view: {} } } } } as const satisfies PermissionGroupNode;
