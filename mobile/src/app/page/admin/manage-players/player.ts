import { User } from 'src/app/model/user';
import { UserResponse } from 'src/app/model/quizz';

export interface Player {

    /** utilisateur associé à ce joueur */
    user: User;

    /** UserResponse associée à ce joueur */
    userResponse: UserResponse;

}