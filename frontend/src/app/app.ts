import { Component, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly pageDocument = inject(DOCUMENT);
  private readonly appRouter = inject(Router);
  readonly darkThemeEnabled = signal(false);
  readonly onProductsPage = signal(this.appRouter.url.startsWith('/products-list'));

  constructor() {
    this.syncProductsPageState(this.appRouter.url);
    this.appRouter.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.syncProductsPageState((event as NavigationEnd).urlAfterRedirects);
    });
  }

  private syncProductsPageState(currentUrl: string) {
    const showPlainProductsLayout = currentUrl.startsWith('/products-list');
    this.onProductsPage.set(showPlainProductsLayout);
    this.pageDocument.documentElement.classList.toggle('plain-products-page', showPlainProductsLayout);
  }

  switchTheme() {
    this.darkThemeEnabled.update((isDarkThemeActive) => !isDarkThemeActive);
    this.pageDocument.documentElement.classList.toggle('theme-dark', this.darkThemeEnabled());
  }
}
