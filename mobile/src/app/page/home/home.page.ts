import { Component, OnInit } from '@angular/core';
import { QuizzComponent } from '../answer/quizz/quizz.component';
import { Quizz } from 'src/app/model/quizz';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  /** Nombre d'indices à trouver */
  nbIndices : number;
  /** Indices trouvés */
  indicesTrouves : string;

  constructor() {}

  ngOnInit(): void {
    this.nbIndices = 11;
    this.indicesTrouves = 'MMMMM';
    //throw new Error("Method not implemented.");
  }





}
