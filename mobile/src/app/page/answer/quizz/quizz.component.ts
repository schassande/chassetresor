import { Component, OnInit } from '@angular/core';
import { IndicesPipe } from 'src/app/utlis/indices.pipe';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss'],
})
export class QuizzComponent implements OnInit {

    /** Nombre d'indices à trouver */
    nbIndices: number;
    /** Indices trouvés */
    indicesTrouves: Array<string>;
    /** Message d'erreur */
    errorMessage: string;
    /** reponse */
    reponse: string;

  constructor() { }

  ngOnInit() {
    this.reponse='';
    this.errorMessage=null;
    this.nbIndices = 11;
    this.initializeIndicesTab('MMMM')
  }

  initializeIndicesTab(indices: string){
    indices = new IndicesPipe().transform(indices, this.nbIndices).toString();
    this.indicesTrouves = new Array<string>();
     for (var i = 0; i < indices.length; i++) {
       if(indices[i]!=' '){
        this.indicesTrouves.push(indices[i]);
       }
    }
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
