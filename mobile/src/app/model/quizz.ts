import { PersistentData } from './common';

/**
 * Classe contenant le quizz et ses questions
 * PS : exposé uniquement dans l'IHM admin de gestion des quizz
 */
export type QuizzStatut = 'INIT' | 'OUVERT' | 'FERME';
export interface Quizz extends PersistentData {
    /** Libelle/nom du quizz */
    libelle: string;
    /** Statut du quizz : INIT, OUVERT ou FERME */
    statut: QuizzStatut;
    /** Questions du quizz */
    questions: {
        /** Identifiant de la question */
        questionId: string;
        /** Libelle de la question */
        libelle: string;
        /** Reponse attendue */
        reponse: string;
    }[];
    /** Gagnant tiré au sort parmis les répondants */
    gagnant: {
        /** Reference l'identifiant du gagnant */
        userId: string;
        /** Email du gagnant */
        email: string;
    };
}

/**
 * Classe contenant la progression de l'utilisateur pour un quizz
 */
export type UserResponseStatut = 'EN_COURS' | 'FINI';
export interface UserResponse extends PersistentData {

    /** Reference l'identifiant de l'utilisateur */
    userId: string; 
    /** Reference l'identifiant du quizz */
    quizzId: string;
    /** Reponse de l'utilisateur pour le quizz */
    reponseQuizz: string;
    /** Statut du quizz vis à vis de l'utilisateur */
    statut: UserResponseStatut;
    /** Indices trouvés par l'utilisateur */
    indicesTrouves: string;
    /** Listes de questions traitées ou à traiter */
    reponsesQuestions: UserQuestion[];
}

/** Questions traitées ou à traiter par l'utilisateur */
export type QuestionReponseStatut = 'NON_SCANNE' | 'SCANNE' | 'VALIDE';
export interface UserQuestion {
    /** Reference l'identifiant de la question */
    questionId: string;
    /** Libelle copié de la question */
    libelle: string;
    /** Taille de la réponse attendue */
    tailleReponse: number;
    /** Reponse de l'utilisateur pour la question */
    reponse: string;
    /** Statut de la question vis à vis de l'utilisateur */
    statut: QuestionReponseStatut;
}

/** Première version */
/*import { PersistentData } from '../common';
import { Question } from './question';
import { User } from 'firebase';
import { type } from 'os';

export interface Quizz extends PersistentData {

    libelle: string;
    questions: Question[];
    gagnant: {
        email: string;
        userId: string;
    };
    statut: QuizzStatut;
}

export interface QuizzResponse extends PersistentData {

    idQuizz: string;
    reponse: string;
    questions: {
        idQuestion: string;
        reponse: string;
        indice: string;
    }[];

}

export interface UserResponse extends PersistentData {

    userId: string;
    quizzId: string;
    statut: UserResponseStatut;
    indiceTrouve: string;
    reponseQuizz: string;
    reponsesQuestions: {
        questionId: string;
        reponse: string;
        statut: QuestionReponseStatut;
    }[];

}*/