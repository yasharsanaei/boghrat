import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentService } from '../../services/document.service';
import { ExcelDoc } from '../../types/excel';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    AsyncPipe,
    NgIf,
    MatTooltipModule,
    NgForOf,
    RouterLink,
  ],
})
export class LayoutComponent {
  isSideNavOpen: WritableSignal<boolean> = signal(false);
  documentService: DocumentService = inject(DocumentService);
  documents: Signal<ExcelDoc<unknown>[] | undefined> = toSignal(
    this.documentService.documents$,
  );
}
