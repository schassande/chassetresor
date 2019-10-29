import { PersistentData } from '../common';
import { Question } from './question';
import { User } from 'firebase';

export interface Quizz extends PersistentData {
    questions: Array<Question>;
    nbIdices:number;
    reponse:string;
    gagnant?:User;
}
