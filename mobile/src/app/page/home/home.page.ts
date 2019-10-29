import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Question } from 'src/app/model/referentiels/question';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  /** Nombre d'indices à trouver */
  nbIndices: number;
  /** Indices trouvés */
  indicesTrouves: string;
  /** Questions en attente */
  questions: Array<Question>;

  constructor(
    private navController: NavController
  ) {}

  /** Mock */
  initMock(): void{
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
  }

  ngOnInit(): void {
    this.initMock();
  }

  /** Methode redirigeant l'utilisateur vers la page de la question demandee */
  redirectQuestionPage(question: Question){
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
