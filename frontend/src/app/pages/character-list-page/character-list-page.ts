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

const TITLES: Record<UniverseId, string> = { digimon: 'Digimon', 'dragon-ball': 'Dragon Ball Z', pokemon: 'Pokémon', 'demon-slayer': 'Demon Slayer' };

@Component({
  selector: 'app-character-list-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './character-list-page.html',
  styleUrl: './character-list-page.css',
})
export class CharacterListPage {
  private readonly route = inject(ActivatedRoute);
  private readonly apis = inject(CharacterApiRegistry);
  private readonly dialog = inject(MatDialog);
  readonly pageSize = 12;
  readonly page = signal<CharacterPage | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly pageIndex = signal(0);
  readonly universe = this.readUniverse(this.route.snapshot.paramMap.get('universe'));
  readonly title = TITLES[this.universe];

  constructor() { this.load(); }

  changePage(event: PageEvent) { this.pageIndex.set(event.pageIndex); this.load(); }
  openImage(character: ExplorerCharacter) {
    this.dialog.open(ImagePreviewDialog, { data: { name: character.name, image: character.image }, maxWidth: '94vw', panelClass: 'image-preview-panel' });
  }

  retry() { this.load(); }

  load() {
    this.loading.set(true); this.error.set(false);
    this.apis.list(this.universe, this.pageIndex()).subscribe({
      next: (result) => { this.page.set(result); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  private readUniverse(value: string | null): UniverseId {
    return value === 'digimon' || value === 'dragon-ball' || value === 'pokemon' || value === 'demon-slayer' ? value : 'digimon';
  }
}
