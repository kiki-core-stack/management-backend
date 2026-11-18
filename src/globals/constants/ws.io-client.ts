import { createWsIoClient } from '@kcs-project/pack/libs/ws.io';
import type { WsIoEvents } from '@kcs-project/pack/types/ws.io-events';
import { checkAndGetEnvValue } from '@kikiutils/shared/env';

export const wsIoClient = createWsIoClient<WsIoEvents.ToServer, WsIoEvents.ToManagementBackend>(
    `${checkAndGetEnvValue('WS_IO_SERVER_BASE_URL')}/management-backend`,
    { initHandler: () => checkAndGetEnvValue('WS_IO_AUTH_KEY') },
);
