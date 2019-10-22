import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/model/question';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

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

  constructor(
    private route: ActivatedRoute, 
    private navController: NavController) {}

  ngOnInit() {
    this.question = JSON.parse(this.route.snapshot.paramMap.get('question'));
  }

  validerSaisie(){
    let reponseCorrecte: Boolean = this.reponse == '1';
    if(reponseCorrecte){
      this.errorMessage=null;
      this.navController.navigateRoot(['/home']);
    } else{
      this.errorMessage="Réponse incorrecte"
    }
  }

}
