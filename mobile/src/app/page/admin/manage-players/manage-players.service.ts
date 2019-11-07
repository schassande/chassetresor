import { Injectable } from '@angular/core';
import { UserService } from 'src/app/service/UserService';
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Player } from './player';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { UserResponse } from 'src/app/model/quizz';
import { ResponseWithData } from 'src/app/service/response';
import { User } from 'src/app/model/user';

@Injectable()
export class ManagePlayersService {

    /** Constructeur */
    constructor(
        private userService: UserService,
        private userResponseService: UserResponseService
    ) { }

    /** Fonction de chargement des Players */
    public loadPlayers(quizzId: string): Observable<Player[]> {

        const listPlayers: Player[] = [];

        // Chargement des UserResponse du quizz passé en param
        return this.userResponseService.query(this.userResponseService.getCollectionRef().where('quizzId', '==', quizzId), 'default').pipe(
            flatMap(rur => {
                const obs: Observable<ResponseWithData<User>>[] = [];
                rur.data.forEach(ru => {
                    obs.push(this.userService.get(ru.userId).pipe(
                        map(rUser => {
                            listPlayers.push({user: rUser.data, userResponse: ru});
                            return rUser;
                        })
                    ));
                })
                return obs.length ? forkJoin(obs) : of('');
            }),
            map(() => {
                return listPlayers;
            })
        );
    }

}