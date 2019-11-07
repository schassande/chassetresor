import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/model/quizz';
import { QuizzService } from 'src/app/service/QuizzService';
import { AlertController } from '@ionic/angular';
import { map, flatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ResponseWithData } from 'src/app/service/response';

@Component({
  selector: 'app-manage-quizz',
  templateUrl: './manage-quizz.component.html',
  styleUrls: ['./manage-quizz.component.scss'],
})
export class ManageQuizzComponent implements OnInit {

  /** La liste des quizz qui sera affichée dans l'écran  */
  listQuizz: Quizz[];

  /** Constructeur */
  constructor(private quizzService: QuizzService,
    private alertCtrl: AlertController) { }

  /** Méthode exécutée à l'initialisation de l'écran */
  ngOnInit() {
    this.loadQuizz().subscribe();
  }

  /**
   * Fonction permettant le chargement tous les quizz présents en base
   */
  loadQuizz(): Observable<ResponseWithData<Quizz[]>> {
    return this.quizzService.all().pipe(
      map(rQuizz => {
        this.listQuizz = rQuizz.data;
        return rQuizz;
      })
    );
  }

  /**
   * Fonction permettant de (re)démarrer un Quizz
   * Il passe alors du statut FERME à OUVERT
   * 
   * @param quizzId l'ID du quizz
   */
  startQuizz(quizzId) {
    this.quizzService.getActiveQuizz().pipe(
      flatMap(openQuizz => {
        // Vérification qu'il n'y a pas déjà un quizz OUVERT
        if (openQuizz) {
          // Si il y a déjà un quizz ouvert => message d'erreur + do nothing
          this.alertCtrl.create({
            header: 'Erreur',
            message: 'Il y a déjà un quizz ouvert actuellement : ' + openQuizz.libelle,
            buttons: ['OK']
          }).then(alert => {
            alert.present();
          });
        } else {
          // Sinon ; ouverture du quizz + update en base
          const quizz = this.listQuizz.find(quizz => quizz.id === quizzId);
          if (quizz) {
            if (quizz.statut == 'FERME') {
              quizz.statut = 'OUVERT';
            }
            return this.quizzService.save(quizz);
          }
        }
        return of('');
      }),
      flatMap(quizz => {
        if (quizz) {
          // Le quizz a ete modifie ==> rech
          return this.loadQuizz();
        } else {
          return of('');
        }
      })
    ).subscribe();
  }

  /**
   * Fonction permettant de stopper un quizz
   * Il passe alors du statut OUVERT à FERME
   * 
   * @param quizzId l'ID du quizz
   */
  stopQuizz(quizzId) {
    const quizz = this.listQuizz.find(quizz => quizz.id === quizzId);
    if (quizz) {
      if (quizz.statut == 'OUVERT') {
        quizz.statut = 'FERME';
      }
    }
    this.quizzService.save(quizz).subscribe();
  }

}
