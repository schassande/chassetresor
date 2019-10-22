import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/model/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  /** Question à trouver */
  question: Question;
  /** Message d'erreur */
  errorMessage: string;
  /** reponse */
  reponse: string;

  constructor() { }

  ngOnInit() {
    this.question = new Question();
    this.question.id='1';
    this.question.libelle='Qui a construit la tour perret ?'


  }

  validerSaisie(){
    let reponseCorrecte: Boolean = false;
    if(reponseCorrecte){
      this.errorMessage=null;
    } else{
      this.errorMessage="Réponse incorrecte"
    }
  }

}
