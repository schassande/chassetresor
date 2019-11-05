import { PersistentData } from '../common';
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

}

export type QuizzStatut = 'INIT' | 'OUVERT' | 'FERME';

export type UserResponseStatut = 'EN_COURS' | 'FINI';

export type QuestionReponseStatut = 'NON_SCANNE' | 'SCANNE' | 'CORRECT' | 'INCORRECT';