import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule, Sort } from '@angular/material/sort';

import { ExcelSheet, ObjectFromList, SheetColumns } from '../../types/excel';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  data: ObjectFromList<SheetColumns>[] = [];
  columns: SheetColumns = [];

  tableData: WritableSignal<ObjectFromList<SheetColumns>[]> = signal([]);
  tableColumns: WritableSignal<{ col: string; isShown: boolean }[]> = signal(
    [],
  );
  activeTableColumns: Signal<string[]> = computed(() =>
    this.tableColumns()
      .filter((t) => t.isShown)
      .map((t) => t.col),
  );

  @Input({ required: true })
  set sheet(_value: ExcelSheet) {
    this.data = _value.data;
    this.columns = _value.columns;
    this.tableData.set(_value.data.slice(0, 20));
    this.tableColumns.set(
      _value.columns.map((c) => ({ col: c, isShown: true })),
    );
  }

  @ViewChild('matTable') matTable: MatTable<any> | undefined = undefined;
  @ViewChild('paginator') paginator: MatPaginator | undefined = undefined;

  sortChange($event: Sort) {
    if ($event.direction === '') {
      this.tableData.set(this.data);
    }
    this.tableData.set(
      this.data.sort((a, b) => this.sort(a, b, $event)).slice(0, 20),
    );
    this.paginator?.firstPage();
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

  toggleColumn(col: string) {
    this.tableColumns.update((columns) => {
      const index = columns.findIndex((c) => c.col === col);
      columns[index].isShown = !columns[index].isShown;
      return columns;
    });
    console.log('------> tableColumns: ', this.activeTableColumns());
    this.matTable?.renderRows();
  }
}
