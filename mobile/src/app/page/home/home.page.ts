import { Component, OnInit } from '@angular/core';
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
    private quizzService: QuizzService) {}

  ngOnInit(): void {
    
    /** Récupération du quizzCourrant */
    this.quizzId = this.quizzService.getActiveQuizzId(); //TODO
    /** Récupération de l'identifiant utilisateur */
    var userId: string = this.connectedUserService.getCurrentUser().id;
    /** Récupération de UserResponse */
    var userReponse: UserResponse = this.userResponseService.getUserResponse(userId, this.quizzId);
    
    /** Initialisation des valeurs de l'écran avec UserResponse */
    if(userReponse){
      this.nbIndices = userReponse.reponsesQuestions.length; // Il y a autant de questions que d'indices
      this.indicesTrouves = userReponse.indicesTrouves;
      this.questions = userReponse.reponsesQuestions.filter(userQuestion => userQuestion.statut == 'SCANNE');
    }
    
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




  /** Mock */
  /*initMock(): void{
    this.nbIndices = 11;
    this.indicesTrouves = 'MMMMM';
    this.questions= new Array<Question>();

    var q1: Question = {
      id: '1',
      libelle: 'Qui suis-je ?',
      nbIndices: 15,
      reponse: null, 
      version: null, 
      creationDate: null, 
      lastUpdate: null, 
      dataStatus: null
    };

    var q2: Question = {
      id: '2',
      libelle: 'Qu\'est ce que l\'agilité ?',
      nbIndices: 3,
      reponse: null, 
      version: null, 
      creationDate: null, 
      lastUpdate: null, 
      dataStatus: null
    };

    this.questions.push(q1);
    this.questions.push(q2);
  }*/