import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { DigimonRestService } from '../services/digimon-rest-service';

@Component({
  selector: 'app-digimon-list',
  imports: [JsonPipe],
  templateUrl: './digimon-list.html',
  styleUrl: './digimon-list.css',
})
export class DigimonList {
  readonly digimonApi = inject(DigimonRestService);
}
