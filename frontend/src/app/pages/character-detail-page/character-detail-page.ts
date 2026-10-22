import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CharacterApiRegistry } from '../../services/character-apis.service';
import { ExplorerCharacter, UniverseId } from '../../interfaces/explorer-character';
import { ImagePreviewDialog } from '../../components/image-preview-dialog/image-preview-dialog';
import { MatDialog } from '@angular/material/dialog';

const TITULOS: Record<UniverseId, string> = { digimon: 'Digimon', 'dragon-ball': 'Dragon Ball Z', pokemon: 'Pokémon', 'demon-slayer': 'Demon Slayer' };

@Component({
  selector: 'app-character-detail-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './character-detail-page.html',
  styleUrl: './character-detail-page.css',
})
export class CharacterDetailPage {
  private readonly ruta = inject(ActivatedRoute);
  private readonly servicios = inject(CharacterApiRegistry);
  private readonly dialogo = inject(MatDialog);
  readonly universo = this.leerUniverso(this.ruta.snapshot.paramMap.get('universe'));
  readonly titulo = TITULOS[this.universo];
  readonly personaje = signal<ExplorerCharacter | null>(null);
  readonly cargando = signal(true);
  readonly huboError = signal(false);

  constructor() {
    const id = this.ruta.snapshot.paramMap.get('id') ?? '';
    this.servicios.detail(this.universo, id).subscribe({ next: (resultado) => { this.personaje.set(resultado); this.cargando.set(false); }, error: () => { this.huboError.set(true); this.cargando.set(false); } });
  }

  abrirImagen(personaje: ExplorerCharacter) { this.dialogo.open(ImagePreviewDialog, { data: { name: personaje.name, image: personaje.image }, maxWidth: '94vw', panelClass: 'image-preview-panel' }); }
  private leerUniverso(value: string | null): UniverseId { return value === 'digimon' || value === 'dragon-ball' || value === 'pokemon' || value === 'demon-slayer' ? value : 'digimon'; }
}
