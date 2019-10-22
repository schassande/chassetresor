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

    var q2: Question = new Question();
    q2.libelle="toto2";
    q2.id='1';
    this.questions.push(q2);

    var q3: Question = new Question();
    q3.libelle="toto3";
    q3.id='1';
    this.questions.push(q3);

    var q1: Question = new Question();
    q1.libelle="toto";
    q1.id='1';
    this.questions.push(q1);

    var q2: Question = new Question();
    q2.libelle="toto2";
    q2.id='1';
    this.questions.push(q2);

    /*var q3: Question = new Question();
    q3.libelle="toto3";
    q3.id='1';
    this.questions.push(q3);

    var q1: Question = new Question();
    q1.libelle="toto";
    q1.id='1';
    this.questions.push(q1);

    var q2: Question = new Question();
    q2.libelle="toto2";
    q2.id='1';
    this.questions.push(q2);

    var q3: Question = new Question();
    q3.libelle="toto3";
    q3.id='1';
    this.questions.push(q3);

    var q1: Question = new Question();
    q1.libelle="toto";
    q1.id='1';
    this.questions.push(q1);

    var q2: Question = new Question();
    q2.libelle="toto2";
    q2.id='1';
    this.questions.push(q2);

    var q3: Question = new Question();
    q3.libelle="toto3";
    q3.id='1';
    this.questions.push(q3);*/


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
