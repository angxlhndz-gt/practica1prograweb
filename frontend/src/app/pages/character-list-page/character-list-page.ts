import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CharacterApiRegistry } from '../../services/character-apis.service';
import { CharacterPage, ExplorerCharacter, UniverseId } from '../../interfaces/explorer-character';
import { ImagePreviewDialog } from '../../components/image-preview-dialog/image-preview-dialog';

const TITULOS: Record<UniverseId, string> = { digimon: 'Digimon', 'dragon-ball': 'Dragon Ball Z', pokemon: 'Pokémon', 'demon-slayer': 'Demon Slayer' };

@Component({
  selector: 'app-character-list-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './character-list-page.html',
  styleUrl: './character-list-page.css',
})
export class CharacterListPage {
  private readonly ruta = inject(ActivatedRoute);
  private readonly servicios = inject(CharacterApiRegistry);
  private readonly dialogo = inject(MatDialog);
  readonly tamanoPagina = 12;
  readonly paginaPersonajes = signal<CharacterPage | null>(null);
  readonly cargando = signal(true);
  readonly huboError = signal(false);
  readonly indicePagina = signal(0);
  readonly universo = this.leerUniverso(this.ruta.snapshot.paramMap.get('universe'));
  readonly titulo = TITULOS[this.universo];

  constructor() { this.cargarPersonajes(); }

  cambiarPagina(event: PageEvent) { this.indicePagina.set(event.pageIndex); this.cargarPersonajes(); }
  abrirImagen(personaje: ExplorerCharacter) {
    this.dialogo.open(ImagePreviewDialog, { data: { name: personaje.name, image: personaje.image }, maxWidth: '94vw', panelClass: 'image-preview-panel' });
  }

  reintentar() { this.cargarPersonajes(); }

  cargarPersonajes() {
    this.cargando.set(true); this.huboError.set(false);
    this.servicios.list(this.universo, this.indicePagina()).subscribe({
      next: (resultado) => { this.paginaPersonajes.set(resultado); this.cargando.set(false); },
      error: () => { this.huboError.set(true); this.cargando.set(false); },
    });
  }

  private leerUniverso(value: string | null): UniverseId {
    return value === 'digimon' || value === 'dragon-ball' || value === 'pokemon' || value === 'demon-slayer' ? value : 'digimon';
  }
}
