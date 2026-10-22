import {Component, input} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {CharacterModel} from '../../interfaces/character-model';
import {NgClass} from '@angular/common';
import {CharacterCardType} from '../../enums/character-card-type';

@Component({
  selector: 'app-character-card',
  imports: [MatCard, MatCardHeader, MatCardContent, NgClass],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard {
  personaje = input<CharacterModel>();
  tipo = input<CharacterCardType>(CharacterCardType.FILLED);
}
