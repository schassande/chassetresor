import { PersistentData } from '../common';

export interface Question extends PersistentData {
    libelle:string;    
    nbIndices:number;
    reponse:string;
}
