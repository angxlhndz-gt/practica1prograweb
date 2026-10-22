import {Injectable, signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {CharacterModel} from '../interfaces/character-model';

@Injectable({
  providedIn: 'root',
})
export class DigimonRestService {

  currentPage = signal<number>(1);

  digimonResource = httpResource<CharacterModel>(
    () => `https://digi-api.com/api/v1/digimon?page=${this.currentPage()}`
  );


}
