import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { CharacterPage, ExplorerCharacter, UniverseId } from '../interfaces/explorer-character';

const PAGE_SIZE = 12;
type Row = Record<string, any>;

function rows(value: unknown): Row[] {
  if (Array.isArray(value)) return value as Row[];
  if (!value || typeof value !== 'object') return [];
  const data = value as Row;
  if (Array.isArray(data['content'])) return data['content'];
  if (Array.isArray(data['items'])) return data['items'];
  if (Array.isArray(data['results'])) return data['results'];
  return [];
}

function total(value: unknown, fallback: number): number {
  if (!value || typeof value !== 'object') return fallback;
  const data = value as Row;
  return data['pageable']?.['totalElements']
    ?? data['pagination']?.['totalElements']
    ?? data['meta']?.['totalItems']
    ?? data['count']
    ?? fallback;
}

function text(value: unknown): string {
  return Array.isArray(value) ? value.map(text).filter(Boolean).join(', ')
    : value && typeof value === 'object' ? String((value as Row)['name'] ?? (value as Row)['level'] ?? '')
      : value == null ? '' : String(value);
}

function field(label: string, value: unknown) {
  const clean = text(value);
  return clean ? { label, value: clean } : null;
}

function normalize(universe: UniverseId, item: Row): ExplorerCharacter {
  const id = item['id'] ?? item['number'] ?? item['url']?.match(/\/(\d+)\/?$/)?.[1] ?? item['name'];
  let image = item['image'] ?? item['img'] ?? item['images']?.[0]?.['href'] ?? '';
  let description = item['description'] ?? '';
  let fields = [] as ReturnType<typeof field>[];

  if (universe === 'dragon-ball') {
    fields = [field('Raza', item['race']), field('Género', item['gender']), field('Ki', item['ki']), field('Ki máximo', item['maxKi']), field('Afiliación', item['affiliation']), field('Planeta de origen', item['originPlanet']), field('Transformaciones', item['transformations'])];
  } else if (universe === 'digimon') {
    description = item['descriptions']?.find((entry: Row) => String(entry['language'] ?? '').toLowerCase().includes('en'))?.['description'] ?? description;
    fields = [field('Nivel', item['levels']), field('Tipo', item['types']), field('Atributo', item['attributes']), field('Año de debut', item['releaseDate']), field('Habilidades', item['skills']?.map((entry: Row) => entry['skill']?.['name'] ?? entry['name'])), field('Evoluciones previas', item['priorEvolutions']?.map((entry: Row) => entry['digimon']?.['name'] ?? entry['name'])), field('Evoluciones siguientes', item['nextEvolutions']?.map((entry: Row) => entry['digimon']?.['name'] ?? entry['name']))];
    image ||= item['images']?.[0]?.['href'] ?? '';
  } else if (universe === 'pokemon') {
    const pokemonId = Number(id);
    image ||= Number.isFinite(pokemonId) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png` : '';
    fields = [field('Tipos', item['types']?.map((entry: Row) => entry['type']?.['name'])), field('Altura', item['height'] ? `${item['height'] / 10} m` : ''), field('Peso', item['weight'] ? `${item['weight'] / 10} kg` : ''), field('Habilidades', item['abilities']?.map((entry: Row) => entry['ability']?.['name'])), field('Experiencia base', item['base_experience']), field('Estadísticas base', item['stats']?.map((entry: Row) => `${entry['stat']?.['name']}: ${entry['base_stat']}`))];
    description ||= fields.filter(Boolean).map((entry) => `${entry!.label}: ${entry!.value}`).join(' · ');
  } else {
    fields = [field('Edad', item['age'] ? `${item['age']} años` : ''), field('Raza', item['race']), field('Género', item['gender']), field('Afiliación', item['affiliation']), field('Estilo de combate', item['combat_style']?.map((entry: Row) => entry['name'])), field('Primera aparición', item['first_arc_appearance']?.['name']), field('Cita', item['quote'])];
  }

  return {
    id: typeof id === 'number' ? id : String(id ?? ''),
    name: String(item['name'] ?? 'Personaje sin nombre'),
    description: String(description || ''),
    image: String(image || 'https://placehold.co/640x480/111827/ffffff?text=Sin+imagen'),
    universe,
    fields: fields.filter((entry): entry is NonNullable<typeof entry> => !!entry),
  };
}

abstract class PagedCharacterApi {
  protected readonly http = inject(HttpClient);
  abstract list(page: number): Observable<CharacterPage>;
  abstract detail(id: string): Observable<ExplorerCharacter>;

  protected page(universe: UniverseId, raw: unknown, page: number, pageSize = PAGE_SIZE): CharacterPage {
    const data = raw && typeof raw === 'object' ? raw as Row : {};
    return { items: rows(raw).map((item) => normalize(universe, item)), total: total(raw, rows(raw).length), page, pageSize };
  }

  protected character(universe: UniverseId, raw: unknown): ExplorerCharacter {
    const data = raw && typeof raw === 'object' ? raw as Row : {};
    const item = data['content']?.[0] ?? data['items']?.[0] ?? data['results']?.[0] ?? data;
    return normalize(universe, item);
  }
}

@Injectable({ providedIn: 'root' })
export class DigimonApiService extends PagedCharacterApi {
  list(page: number) {
    return this.http.get<unknown>(`https://digi-api.com/api/v1/digimon?page=${page}&pageSize=${PAGE_SIZE}`)
      .pipe(map((raw) => this.page('digimon', raw, page)));
  }
  detail(id: string) {
    return this.http.get<unknown>(`https://digi-api.com/api/v1/digimon/${encodeURIComponent(id)}`)
      .pipe(map((raw) => this.character('digimon', raw)));
  }
}

@Injectable({ providedIn: 'root' })
export class DragonBallApiService extends PagedCharacterApi {
  list(page: number) {
    return this.http.get<unknown>(`https://dragonball-api.com/api/characters?page=${page + 1}&limit=${PAGE_SIZE}`)
      .pipe(map((raw) => this.page('dragon-ball', raw, page)));
  }
  detail(id: string) {
    return this.http.get<unknown>(`https://dragonball-api.com/api/characters/${encodeURIComponent(id)}`)
      .pipe(map((raw) => this.character('dragon-ball', raw)));
  }
}

@Injectable({ providedIn: 'root' })
export class PokemonApiService extends PagedCharacterApi {
  list(page: number) {
    return this.http.get<unknown>(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`)
      .pipe(map((raw) => this.page('pokemon', raw, page)));
  }
  detail(id: string) {
    return this.http.get<unknown>(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(id)}`)
      .pipe(map((raw) => this.character('pokemon', raw)));
  }
}

@Injectable({ providedIn: 'root' })
export class DemonSlayerApiService extends PagedCharacterApi {
  list(page: number) {
    return this.http.get<unknown>(`https://www.demonslayer-api.com/api/v1/characters?limit=${PAGE_SIZE}&page=${page + 1}`)
      .pipe(map((raw) => this.page('demon-slayer', raw, page)));
  }
  detail(id: string) {
    return this.http.get<unknown>(`https://www.demonslayer-api.com/api/v1/characters?id=${encodeURIComponent(id)}`)
      .pipe(map((raw) => this.character('demon-slayer', raw)));
  }
}

@Injectable({ providedIn: 'root' })
export class CharacterApiRegistry {
  private readonly digimon = inject(DigimonApiService);
  private readonly dragonBall = inject(DragonBallApiService);
  private readonly pokemon = inject(PokemonApiService);
  private readonly demonSlayer = inject(DemonSlayerApiService);

  list(universe: UniverseId, page: number) {
    return this.api(universe).list(page);
  }

  detail(universe: UniverseId, id: string) {
    return this.api(universe).detail(id);
  }

  private api(universe: UniverseId): PagedCharacterApi {
    return ({ digimon: this.digimon, 'dragon-ball': this.dragonBall, pokemon: this.pokemon, 'demon-slayer': this.demonSlayer })[universe];
  }
}
