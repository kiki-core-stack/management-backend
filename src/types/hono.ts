import type { AuthenticationSessionData } from '@kcs-project/pack/types/data/authentication-session';
import type { Types } from 'mongoose';

declare module 'hono' {
    interface Context {
        adminAuthenticationSession?: AuthenticationSessionData;
        adminId?: Types.ObjectId;
    }
}
