import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserQuestion, UserResponse } from 'src/app/model/quizz';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { QuizzService } from 'src/app/service/QuizzService';

export type PageStatus =  'CHARGEMENT' | 'AUCUN_QUIZZ' | 'QUESTIONS_A_SCANNER'| 'QUESTIONS_A_TRAITER' | 'INDICES_TROUVES' | 'QUIZZ_TERMINE';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  /** Statut de la page utilisé pour les differentes configurations de l'écran */
  pageStatus: PageStatus;

  /** Identifiant du quizz Actif */
  quizzId: string;
  /** Nombre d'indices total à trouver */
  nbIndices: number = 0;
  /** Indices trouvés par l'utilisateur */
  indicesTrouves: string = '';
  /** Questions en attente de réponse */
  questions: UserQuestion[] = [];
  /** Quizz validé ? */
  isQuizzValide: boolean = false;

  constructor(
    private navController: NavController,
    private userResponseService: UserResponseService,
    private connectedUserService: ConnectedUserService,
    private quizzService: QuizzService,
    private changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pageStatus = 'CHARGEMENT';
    this.loadValues();
  }

  /** Chargement des valeurs de l'écran */
  loadValues() {
    var vm = this;

    /** Etape 1 : Récupération de l'identifiant du Quizz courant */
    this.quizzService.getActiveQuizzId().toPromise().then(function(rQuizzId){
      if(!rQuizzId){
        return;
      } else{
        vm.quizzId = rQuizzId;
        /** Etape 2 : Récupération de UserResponse */
        return vm.userResponseService.loadUserResponse(vm.connectedUserService.getCurrentUser().id, vm.quizzId);
      }
    }).then(function(rUserResponse){
      /** Etape 3 : Initialisation des valeurs de l'écran avec UserResponse */
      if(rUserResponse){
        vm.nbIndices = rUserResponse.reponsesQuestions.length; // Il y a autant de questions que d'indices
        vm.indicesTrouves = rUserResponse.indicesTrouves;
        vm.questions = rUserResponse.reponsesQuestions.filter(userQuestion => userQuestion.statut == 'SCANNE');
        vm.isQuizzValide = rUserResponse.statut == 'FINI';
      }
    }).finally(function(){
      /** Calcul du statut de l'ecran */
      if(!vm.quizzId){
        vm.pageStatus = 'AUCUN_QUIZZ';
      } else if (vm.isQuizzValide){
        vm.pageStatus = 'QUIZZ_TERMINE';
      } else if(vm.hasAllIndices()) {
        vm.pageStatus = 'INDICES_TROUVES';
      } else if(vm.hasQuestions()){
        vm.pageStatus = 'QUESTIONS_A_TRAITER';
      } else {
        vm.pageStatus = 'QUESTIONS_A_SCANNER';
      }

      /** Syncronization des changements */
      vm.changeRef.detectChanges();
    })
  }

  /** Methode redirigeant l'utilisateur vers la page de la question demandee */
  redirectQuestionPage(question: UserQuestion){
    this.navController.navigateRoot(['/question/' + JSON.stringify(question)]);
  }

  /** Methode redirigeant l'utilisateur vers la page de réponse au quiz */
  redirectQuizzPage(question: UserQuestion){
    this.navController.navigateRoot(['/quizz']);
  }

  /** Methode verifiant si l'utilisateur detiens tous les indices */
  hasAllIndices(): boolean{
    return this.indicesTrouves.length == this.nbIndices;
  }
  /** Methode verifiant si l'utilisateur a des questions en attente */
  hasQuestions(): boolean{
    return this.questions.length>0;
  }
  
}