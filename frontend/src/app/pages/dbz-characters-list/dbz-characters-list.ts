import {Component} from '@angular/core';
import {CharacterCard} from '../../components/character-card/character-card';
import {CharacterModel} from '../../interfaces/character-model';
import {CharacterCardType} from '../../enums/character-card-type';

@Component({
  selector: 'app-dbz-characters-list',
  imports: [CharacterCard],
  templateUrl: './dbz-characters-list.html',
  styleUrl: './dbz-characters-list.css',
})
export class DbzCharactersList {

  readonly characterCardType = CharacterCardType;

  readonly dragonBallRoster = [
    {
      "id": 1,
      "name": "Goku",
      "ki": "60.000.000",
      "maxKi": "90 Septillion",
      "race": "Saiyan",
      "gender": "Male",
      "description": "El protagonista de la serie, conocido por su gran poder y personalidad amigable. Originalmente enviado a la Tierra como un infante volador con la misión de conquistarla. Sin embargo, el caer por un barranco le proporcionó un brutal golpe que si bien casi lo mata, este alteró su memoria y anuló todos los instintos violentos de su especie, lo que lo hizo crecer con un corazón puro y bondadoso, pero conservando todos los poderes de su raza. No obstante, en la nueva continuidad de Dragon Ball se establece que él fue enviado por sus padres a la Tierra con el objetivo de sobrevivir a toda costa a la destrucción de su planeta por parte de Freeza. Más tarde, Kakarot, ahora conocido como Son Goku, se convertiría en el príncipe consorte del monte Fry-pan y líder de los Guerreros Z, así como el mayor defensor de la Tierra y del Universo 7, logrando mantenerlos a salvo de la destrucción en innumerables ocasiones, a pesar de no considerarse a sí mismo como un héroe o salvador.",
      "image": "https://dragonball-api.com/characters/goku_normal.webp",
      "affiliation": "Z Fighter",
      "deletedAt": null
    },
    {
      "id": 2,
      "name": "Vegeta",
      "ki": "54.000.000",
      "maxKi": "19.84 Septillion",
      "race": "Saiyan",
      "gender": "Male",
      "description": "Príncipe de los Saiyans, inicialmente un villano, pero luego se une a los Z Fighters. A pesar de que a inicios de Dragon Ball Z, Vegeta cumple un papel antagónico, poco después decide rebelarse ante el Imperio de Freeza, volviéndose un aliado clave para los Guerreros Z. Con el paso del tiempo llegaría a cambiar su manera de ser, optando por permanecer y vivir en la Tierra para luchar a su lado contra las inminentes adversidades que superar. Junto con Piccolo, él es de los antiguos enemigos de Goku que ha evolucionando al pasar de ser un villano y antihéroe, a finalmente un héroe a lo largo del transcurso de la historia, convirtiéndose así en el deuteragonista de la serie.",
      "image": "https://dragonball-api.com/characters/vegeta_normal.webp",
      "affiliation": "Z Fighter",
      "deletedAt": null
    }
  ]

  toDragonBallCards(): CharacterModel[] {
    return this.dragonBallRoster.map(
      characterRecord => this.toCharacterCard(characterRecord)
    );
  }

  private toCharacterCard(characterRecord: any): CharacterModel {
    return {
      id: characterRecord.id,
      name: characterRecord.name,
      description: characterRecord.description,
      img: characterRecord.image
    }
  }
}
