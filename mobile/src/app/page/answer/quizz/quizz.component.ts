import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IndicesPipe } from 'src/app/utlis/indices.pipe';
import { ValidationService } from 'src/app/service/ValidationService';
import { QuizzService } from 'src/app/service/QuizzService';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';

export type PageStatus =  'CHARGEMENT' | 'QUIZZ_INDISPONIBLE' | 'QUIZZ_DISPONBILE' | 'QUIZZ_TERMINE';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit {

    /** Statut de la page */
    pageStatus: PageStatus;

    /** Identifiant du quizz Actif */
    quizzId: string;
    /** Nombre d'indices à trouver */
    nbIndices: number = 0;
    /** Indices trouvés */
    indicesTrouves: Array<string> = [];
    /** Reponse de l'utilisateur */
    reponse: string = '';
    /** Quizz validé ? */
    isQuizzValide: boolean = false;

  constructor(
    private validationService: ValidationService,
    private quizzService: QuizzService,
    private userResponseService: UserResponseService,
    private connectedUserService: ConnectedUserService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pageStatus = 'CHARGEMENT';
    this.loadValues();
  }

  loadValues() {
    var vm = this;
    /** Etape 1 : Récupération de l'identifiant du Quizz courant */
    this.quizzService.getActiveQuizzId().toPromise().then(function(rQuizzId){
      vm.quizzId = rQuizzId;
      /** Etape 2 : Récupération de UserResponse */
      return vm.userResponseService.getUserResponse(vm.connectedUserService.getCurrentUser().id, vm.quizzId).toPromise()
    }).then(function(rUserResponse){
      /** Etape 3 : Initialisation des valeurs de l'écran avec UserResponse */
      if(rUserResponse){
        vm.nbIndices = rUserResponse.reponsesQuestions.length;
        vm.initializeIndicesTab(rUserResponse.indicesTrouves);
      }
      vm.changeRef.detectChanges();
    }).finally(function(){
      /** Calcul du statut de l'ecran */
      if(!vm.quizzId){
        vm.pageStatus = 'QUIZZ_INDISPONIBLE';
      } else if (vm.isQuizzValide){
        vm.pageStatus = 'QUIZZ_TERMINE';
      } else {
        vm.pageStatus = 'QUIZZ_DISPONBILE';
      }

      /** Syncronization des changements */
      vm.changeRef.detectChanges();
    })
  }

  initializeIndicesTab(indices: string){
    indices = new IndicesPipe().transform(indices, this.nbIndices).toString();
    this.indicesTrouves = new Array<string>();
     for (var i = 0; i < indices.length; i++) {
       if(indices[i]!=' '){
        this.indicesTrouves.push(indices[i]);
       }
    }
  }

  validerSaisie(){
    this.validationService.validerQuizz(this.reponse,this.quizzId,this.connectedUserService.getCurrentUser().id);
  }

}
