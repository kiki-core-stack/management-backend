import type { PermissionTree } from '@kcs-project/pack/types/permission';

export const home = { dashboard: { view: true } } as const satisfies PermissionTree;
