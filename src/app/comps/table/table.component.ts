import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule, Sort } from '@angular/material/sort';

import { ExcelSheet, ObjectFromList, SheetColumns } from '../../types/excel';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  data: ObjectFromList<SheetColumns>[] = [];
  columns: SheetColumns = [];

  tableData: WritableSignal<ObjectFromList<SheetColumns>[]> = signal([]);
  // tableColumns: WritableSignal<SheetColumns> = signal([]);

  @Input({ required: true })
  set sheet(_value: ExcelSheet) {
    this.data = _value.data;
    this.columns = _value.columns;
    this.tableData.set(_value.data.splice(0, 20));
  }

  @ViewChild('matTable') matTable: MatTable<any> | undefined = undefined;

  sortChange($event: Sort) {
    if ($event.direction === '') {
      this.tableData.set(this.data);
    }
    this.tableData.mutate((data) => {
      return data.sort((a, b) => this.sort(a, b, $event));
    });
    this.matTable?.renderRows();
  }

  private sort(
    a: ObjectFromList<SheetColumns, number | string | any>,
    b: ObjectFromList<SheetColumns, number | string | any>,
    sort: Sort,
  ) {
    switch (sort.direction) {
      case 'asc':
        if (typeof a[sort.active] === 'string') {
          return a[sort.active]
            .toLowerCase()
            .localeCompare(b[sort.active].toLowerCase());
        } else if (typeof a[sort.active] === 'number') {
          return b[sort.active] - a[sort.active];
        }
        return 0;
      case 'desc':
        if (typeof a[sort.active] === 'string') {
          return b[sort.active]
            .toLowerCase()
            .localeCompare(a[sort.active].toLowerCase());
        } else if (typeof a[sort.active] === 'number') {
          return a[sort.active] - b[sort.active];
        }
        return 0;
      default:
        return 0;
    }
  }

  pageEvent(page: PageEvent) {
    this.tableData.set(
      this.data.slice(
        page.pageIndex * page.pageSize,
        (page.pageIndex + 1) * page.pageSize,
      ),
    );
  }
}
