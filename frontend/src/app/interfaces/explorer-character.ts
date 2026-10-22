export type UniverseId = 'digimon' | 'dragon-ball' | 'pokemon' | 'demon-slayer';

export interface CharacterField {
  label: string;
  value: string;
}

export interface ExplorerCharacter {
  id: string | number;
  name: string;
  description: string;
  image: string;
  universe: UniverseId;
  fields: CharacterField[];
}

export interface CharacterPage {
  items: ExplorerCharacter[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UniverseInfo {
  id: UniverseId;
  title: string;
  description: string;
  image: string;
}
