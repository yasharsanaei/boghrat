import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { TableComponent } from '../../comps/table/table.component';
import { DocumentService } from '../../services/document.service';
import { ExcelDoc, ExcelSheet } from '../../types/excel';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
  ],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent {
  document: Signal<ExcelDoc | undefined>;
  sheets: Signal<ExcelSheet[] | []>;

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
    this.sheets = computed(() => this.document()?.sheets || []);
    console.log('-----> this.sheets: ', this.sheets());
  }
}
