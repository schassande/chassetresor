import { PersistentData } from './common';

export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'FACEBOOK';
export type AppRole = 'USER' | 'ADMIN';
export type AccountStatus = 'VALIDATION_REQUIRED' | 'ACTIVE' | 'LOCKED' | 'DELETED';

export interface User extends PersistentData {
    email: string;
    password?: string;
    accountId: string;
    token?: string;
    role: AppRole;
    authProvider?: AuthProvider;
    accountStatus: AccountStatus;
}
