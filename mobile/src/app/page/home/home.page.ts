import { Component, OnInit } from '@angular/core';
import { QuizzComponent } from '../answer/quizz/quizz.component';
import { Quizz } from 'src/app/model/quizz';
import { Question } from 'src/app/model/question';

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

  constructor() {}

  ngOnInit(): void {
    this.nbIndices = 11;
    this.indicesTrouves = 'MMMMM';
    this.questions= new Array<Question>();

    var q1: Question = new Question();
    q1.libelle="toto";
    q1.id='1';
    this.questions.push(q1);
  }

  /** Methode redirigeant l'utilisateur vers la page de la question demandee */
  redirectQuestionPage(question: Question){
    alert(question.id);
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
