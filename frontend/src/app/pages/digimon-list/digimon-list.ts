import {Component, inject} from '@angular/core';
import {DigimonRestService} from '../../services/digimon-rest-service';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-digimon-list',
  imports: [JsonPipe],
  templateUrl: './digimon-list.html',
  styleUrl: './digimon-list.css',
})
export class DigimonList {

  readonly digimonApi = inject(DigimonRestService);
}
