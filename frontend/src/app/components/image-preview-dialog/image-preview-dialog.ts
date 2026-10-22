import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `<div class="preview-head"><div><p>VISTA AMPLIADA</p><h2 mat-dialog-title>{{ data.name }}</h2></div><button mat-icon-button mat-dialog-close aria-label="Cerrar imagen"><mat-icon>close</mat-icon></button></div><mat-dialog-content><img [src]="data.image" [alt]="data.name"></mat-dialog-content>`,
  styles: [`.preview-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px 0}.preview-head p{margin:0;color:#8791a6;font-size:10px;letter-spacing:.16em}.preview-head h2{padding:0;margin:4px 0 0}.mat-mdc-dialog-content{padding:12px 20px 20px}.mat-mdc-dialog-content img{display:block;max-width:min(78vw,900px);max-height:72vh;width:auto;height:auto;margin:auto;object-fit:contain;border-radius:12px}`],
})
export class ImagePreviewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: { name: string; image: string }) {}
}
