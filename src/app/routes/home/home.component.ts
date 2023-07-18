import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FileUploadComponent } from '../../comps/file-upload/file-upload.component';
import { DocumentService } from '../../services/document.service';
import { ExcelDoc } from '../../types/excel';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatListModule, FileUploadComponent],
})
export class HomeComponent {
  documentService: DocumentService = inject(DocumentService);
  documents: Signal<ExcelDoc<unknown>[] | undefined> = toSignal(
    this.documentService.documents$,
  );
}
