import { join } from 'node:path';

import { writeManagementPermissionTypesFile } from '@kiki-core-stack/pack/libs/management/permission-types-file';
import type { ManagementType } from '@kiki-core-stack/pack/types';
import { capitalize } from 'es-toolkit';

const baseGeneratedStaticTypesDirPath = join(
    (await import('@/core/constants/paths')).projectSrcDirPath,
    'generated/static/types',
);

const managementTypes: ManagementType[] = ['admin'];
await Promise.all(
    managementTypes.map(async (managementType) => {
        logger.info(`Generating ${managementType} permission types...`);
        const module = await await import(`@/constants/${managementType}`);
        const allPermissions: Set<string> = module[`all${capitalize(managementType)}Permissions`];
        await writeManagementPermissionTypesFile(
            managementType,
            [...allPermissions],
            join(baseGeneratedStaticTypesDirPath, managementType, 'permission.ts'),
        );

        logger.success(`Generated ${managementType} permission types`);
    }),
);
