import {Component} from '@angular/core';
import {CharacterCard} from '../../components/character-card/character-card';
import {CharacterModel} from '../../interfaces/character-model';
import {CharacterCardType} from '../../enums/character-card-type';

@Component({
  selector: 'app-demon-slayer-characters-list',
  imports: [CharacterCard],
  templateUrl: './demon-slayer-characters-list.html',
  styleUrl: './demon-slayer-characters-list.css',
})
export class DemonSlayerCharactersList {

  readonly tipoTarjeta = CharacterCardType;

  readonly personajesDemonSlayer = [
    {
      "id": 1,
      "name": "Tanjiro Kamado",
      "age": 16,
      "gender": "Male",
      "race": "Human",
      "description": "Is the main protagonist of Demon Slayer. He joined the Demon Slayer Corp to find a remedy to turn his sister, Nezuko Kamado, back into a human and to hunt down and kill demons.",
      "img": "https://www.demonslayer-api.com/api/v1/characters/images/1.webp",
      "affiliation_id": 1,
      "arc_id": 1,
      "quote": "Work at it. All I can do is work hard! That´s the story of my life!"
    },
    {
      "id": 2,
      "name": "Nezuko Kamado",
      "age": 14,
      "gender": "Female",
      "race": "Demon",
      "description": "She is a demon and the younger sister of Tanjiro Kamado and one of the two remaining members of the Kamado family. Formerly a human, she was attacked and transformed into a demon by Muzan Kibutsuji.",
      "img": "https://www.demonslayer-api.com/api/v1/characters/images/2.webp",
      "affiliation_id": 1,
      "arc_id": 1,
      "quote": "Humans are to be protected and saved... I will never hurt them."
    },
    {
      "id": 3,
      "name": "Giyu Tomioka",
      "age": 21,
      "gender": "Male",
      "race": "Human",
      "description": "He is a Demon Slayer of the Demon Slayer Corps and the current Water Hashira. He has a reserved personality and a very strong sense of justice.",
      "img": "https://www.demonslayer-api.com/api/v1/characters/images/3.webp",
      "affiliation_id": 2,
      "arc_id": 1,
      "quote": "Feel the rage. The powerful, pure rage of not being able to forgive will become your unswerving drive to take action."
    },
    {
      "id": 4,
      "name": "Sakonji Urokodaki",
      "age": 70,
      "gender": "Male",
      "race": "Human",
      "description": "Sakonji Urokodaki is a retired member of the Demon Slayer Corps, having held the position of the previous Water Hashira. He is the main cultivator of the Water Breathing style, having trained Makomo, Sabito, Giyu Tomioka, and Tanjiro Kamado.",
      "img": "https://www.demonslayer-api.com/api/v1/characters/images/4.webp",
      "affiliation_id": 3,
      "arc_id": 1,
      "quote": "Remember to take a long breath so the oxygen flows into every cell in your body."
    },
    {
      "id": 5,
      "name": "Sabito",
      "age": 13,
      "gender": "Male",
      "race": "Human",
      "description": "Sabito was a former apprentice of Sakonji Urokodaki. He appeared to assist Tanjiro Kamado in his preparations for the Final Selection exam.",
      "img": "https://www.demonslayer-api.com/api/v1/characters/images/5.webp",
      "affiliation_id": 1,
      "arc_id": 1,
      "quote": "You have to make sure you never forget any of the secrets Urokodaki taught you! Pound it into the marrow of your bones!"
    }
  ]

  crearTarjetasDemonSlayer(): CharacterModel[] {
    return this.personajesDemonSlayer.map(
      personajeApi => this.crearTarjeta(personajeApi)
    );
  }

  private crearTarjeta(personajeApi: any): CharacterModel {
    return {
      id: personajeApi.id,
      name: personajeApi.name,
      description: personajeApi.description,
      img: personajeApi.img
    }
  }
}
