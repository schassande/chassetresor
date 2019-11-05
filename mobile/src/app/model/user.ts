import { PersistentData } from './common';
import { Partie } from './partie';

export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'FACEBOOK';
export type AppRole = 'USER' | 'ADMIN';
export type AccountStatus = 'VALIDATION_REQUIRED' | 'ACTIVE' | 'LOCKED' | 'DELETED';

export interface User extends PersistentData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: Number;
    accountId: string;
    token?: string;
    role: AppRole;
    authProvider?: AuthProvider;
    accountStatus: AccountStatus;
    parties?: Array<Partie>;
}
