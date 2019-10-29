import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Question } from 'src/app/model/referentiels/question';
import { AlertController } from '@ionic/angular';
import { Alert } from 'selenium-webdriver';

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
    private navController: NavController,
    public alertController: AlertController) {}

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
    this.presentAlert();
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'This is an alert message.'
    });

    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 800);

  }
  
}
