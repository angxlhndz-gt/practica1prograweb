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
  private readonly documento = inject(DOCUMENT);
  private readonly enrutador = inject(Router);
  readonly temaOscuro = signal(false);
  readonly enProductos = signal(this.enrutador.url.startsWith('/products-list'));

  constructor() {
    this.actualizarPaginaProductos(this.enrutador.url);
    this.enrutador.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.actualizarPaginaProductos((event as NavigationEnd).urlAfterRedirects);
    });
  }

  private actualizarPaginaProductos(urlActual: string) {
    const esVistaProductos = urlActual.startsWith('/products-list');
    this.enProductos.set(esVistaProductos);
    this.documento.documentElement.classList.toggle('plain-products-page', esVistaProductos);
  }

  cambiarTema() {
    this.temaOscuro.update((temaActivo) => !temaActivo);
    this.documento.documentElement.classList.toggle('theme-dark', this.temaOscuro());
  }
}
