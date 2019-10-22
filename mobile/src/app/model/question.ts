import { PersistentData } from './common';

export class Question implements PersistentData {

    version: number;
    creationDate: Date;
    lastUpdate: Date;
    dataStatus: import("./common").DataStatus;
    id: string;

    libelle: string;

    constructor() {}
    
}
