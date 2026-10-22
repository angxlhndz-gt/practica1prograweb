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

const TITLES: Record<UniverseId, string> = { digimon: 'Digimon', 'dragon-ball': 'Dragon Ball Z', pokemon: 'Pokémon', 'demon-slayer': 'Demon Slayer' };

@Component({
  selector: 'app-character-detail-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './character-detail-page.html',
  styleUrl: './character-detail-page.css',
})
export class CharacterDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly apis = inject(CharacterApiRegistry);
  private readonly dialog = inject(MatDialog);
  readonly universe = this.readUniverse(this.route.snapshot.paramMap.get('universe'));
  readonly title = TITLES[this.universe];
  readonly character = signal<ExplorerCharacter | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.apis.detail(this.universe, id).subscribe({ next: (item) => { this.character.set(item); this.loading.set(false); }, error: () => { this.error.set(true); this.loading.set(false); } });
  }

  openImage(item: ExplorerCharacter) { this.dialog.open(ImagePreviewDialog, { data: { name: item.name, image: item.image }, maxWidth: '94vw', panelClass: 'image-preview-panel' }); }
  private readUniverse(value: string | null): UniverseId { return value === 'digimon' || value === 'dragon-ball' || value === 'pokemon' || value === 'demon-slayer' ? value : 'digimon'; }
}
