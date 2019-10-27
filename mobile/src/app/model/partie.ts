import { Reference } from '@angular/fire/storage/interfaces';
import { PersistentData } from './common';

export interface Partie extends PersistentData {

    /** Reference du quizz de la partie */
    refQuizz: Reference;

    /** Public questions en attente de réponse (état : scannées sans réponse juste) */
    refQuestionsEnAttente: Array<Reference>;

    /** Public question validées (état : scannée avec une réponse juste) */
    refQuestionsValides: Array<Reference>;
    
}