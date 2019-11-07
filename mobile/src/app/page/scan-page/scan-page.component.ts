import { QuizzService } from 'src/app/service/QuizzService';
import { NavController, AlertController } from '@ionic/angular';
import { UserResponseService } from 'src/app/service/UserResponseService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss'],
})
export class ScanPageComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

  constructor(private alertCtrl: AlertController,
              private navController: NavController,
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
      const [quizzId, questionId] = result.split('.');
      console.log('quizzId', quizz, 'questionId', questionId);
      if (quizz.id === quizzId) {
        this.navController.navigateRoot(`/question/${questionId}`);
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
