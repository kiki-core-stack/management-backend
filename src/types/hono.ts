import type { AuthenticationSessionData } from '@kiki-core-stack/pack/types/data/authentication-session';
import type { Types } from 'mongoose';

declare module 'hono' {
    interface Context {
        adminAuthenticationSession?: AuthenticationSessionData;
        adminId?: Types.ObjectId;
    }
}
