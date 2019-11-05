import { ToastController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { QuizzResponse } from '../model/referentiels/quizz';

@Injectable()
export class QuizzResponseService  extends RemotePersistentDataService<QuizzResponse> {

    constructor(
        db: AngularFirestore,
        toastController: ToastController,
    ) {
        super(db, toastController);
    }

    getLocalStoragePrefix(): string {
        return 'quizzresponse';
    }

    getPriority(): number {
        return 1;
    }

}
