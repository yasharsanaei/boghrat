import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { ExcelDoc } from '../../types/excel';
import { combineLatest, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent {
  document: Signal<ExcelDoc<unknown> | undefined>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private documentService: DocumentService,
  ) {
    this.document = toSignal(
      combineLatest([
        this.activatedRoute.params,
        this.documentService.documents$,
      ]).pipe(map(([params, doc]) => doc.find((d) => d.id === params['id']))),
    );
  }
}
