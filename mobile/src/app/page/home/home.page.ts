import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserQuestion, UserResponse } from 'src/app/model/quizz';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { QuizzService } from 'src/app/service/QuizzService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  /** Identifiant du quizz Actif */
  quizzId: string;
  /** Nombre d'indices à trouver */
  nbIndices: number = 0;
  /** Indices trouvés */
  indicesTrouves: string = '';
  /** Questions en attente de réponse */
  questions: UserQuestion[] = [];

  constructor(
    private navController: NavController,
    private userResponseService: UserResponseService,
    private connectedUserService: ConnectedUserService,
    private quizzService: QuizzService,
    private changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    /** Chargement des valeurs de l'écran */
    this.loadValues();
  }

  loadValues() {
    var vm = this;
    /** Etape 1 : Récupération de l'identifiant du Quizz courant */
    this.quizzService.getActiveQuizzId().toPromise().then(function(rQuizzId){
      vm.quizzId = rQuizzId;
      /** Etape 2 : Récupération de UserResponse */
      return vm.userResponseService.loadUserResponse(vm.connectedUserService.getCurrentUser().id, vm.quizzId)
    }).then(function(rUserResponse){
      /** Etape 3 : Initialisation des valeurs de l'écran avec UserResponse */
      if(rUserResponse){
        vm.nbIndices = rUserResponse.reponsesQuestions.length; // Il y a autant de questions que d'indices
        vm.indicesTrouves = rUserResponse.indicesTrouves;
        vm.questions = rUserResponse.reponsesQuestions.filter(userQuestion => userQuestion.statut == 'SCANNE');
      }
      /** Etape 4 : Syncronization des changements */
      vm.changeRef.detectChanges();
    })
  }

  /** Methode redirigeant l'utilisateur vers la page de la question demandee */
  redirectQuestionPage(question: UserQuestion){
    this.navController.navigateRoot(['/question/' + JSON.stringify(question)]);
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