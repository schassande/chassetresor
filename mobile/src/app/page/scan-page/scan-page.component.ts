import { map, flatMap } from 'rxjs/operators';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { QuizzService } from 'src/app/service/QuizzService';
import { NavController, AlertController } from '@ionic/angular';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { of } from 'rxjs';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss'],
})
export class ScanPageComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

  constructor(private alertCtrl: AlertController,
              private navController: NavController,
              private userResponseService: UserResponseService,
              private connectedUserService: ConnectedUserService,
              private quizzService: QuizzService) { }

    ngOnInit() {
      this.qrScannerComponent.getMediaDevices().then(devices => {
          const videoDevices: MediaDeviceInfo[] = [];
          for (const device of devices) {
              if (device.kind.toString() === 'videoinput') {
                  videoDevices.push(device);
              }
          }
          if (videoDevices.length > 0){
              let choosenDev;
              for (const dev of videoDevices){
                  if (dev.label.includes('front')){
                      choosenDev = dev;
                      break;
                  }
              }
              if (choosenDev) {
                  this.qrScannerComponent.chooseCamera.next(choosenDev);
              } else {
                  this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
              }
          }
      });

      this.qrScannerComponent.capturedQr.subscribe(result => {
          this.onScan(result);
      });
  }

  onScan(result) {
    console.log('Resultat du scan', result);
    this.quizzService.getActiveQuizz().subscribe((quizz) => {
      const [libelleQuizz, questionIdxStr] = result.split('.');
      const questionIdx: number = parseInt(questionIdxStr, 10) - 1;
      let questionId = '';
      console.log('quizzId', quizz, 'questionIdx', questionIdx);
      if (quizz.libelle === libelleQuizz) {
        // mise a jour de la reponse utilisateur pour indiquer que la question est scannee
        this.userResponseService.getUserResponse(this.connectedUserService.getCurrentUser().id, quizz.id).pipe(
          flatMap(rur => {
            questionId = rur.reponsesQuestions[questionIdx].questionId;
            if (rur.reponsesQuestions[questionIdx].statut === 'NON_SCANNE') {
              rur.reponsesQuestions[questionIdx].statut = 'SCANNE';
              return this.userResponseService.save(rur);
            }
            return of({data: null, error: 'ALREADY'});
          }),
          map((rur) => {
            this.navController.navigateRoot(`/question/${questionId}`);
          })
        ).subscribe();
      } else {
        this.alertCtrl.create({
          header: 'Erreur',
          message: 'Ce quizz n\'est pas ouvert',
          buttons: ['OK']
        }).then(alert => {
          alert.present();
        });

      }
    });
  }
}
