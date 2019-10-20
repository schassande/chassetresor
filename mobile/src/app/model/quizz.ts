import { PersistentData } from './common';
import { Question } from './question';

export interface Quizz extends PersistentData {
    questions : Array<Question>;
    indices : Array<string>;
}
