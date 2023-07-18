import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { ExcelDoc, ExcelSheet } from '../../types/excel';
import { combineLatest, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableComponent } from '../../comps/table/table.component';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
];

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule, TableComponent, MatListModule, MatTableModule],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

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