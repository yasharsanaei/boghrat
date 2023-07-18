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

import { ObjectFromList, SheetColumns } from '../../types/excel';
import { MatPaginatorModule } from '@angular/material/paginator';

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
  tableData: WritableSignal<ObjectFromList<SheetColumns>[]> = signal([]);
  private rawData: ObjectFromList<SheetColumns>[] = [];

  @Input({ required: true })
  set data(_value: ObjectFromList<SheetColumns>[]) {
    this.tableData.set(_value);
    this.rawData = [..._value];
  }

  @Input({ required: true })
  columns: SheetColumns = [];

  @Input({ required: true })
  name = '';

  @ViewChild('matTable') matTable: MatTable<any> | undefined = undefined;

  sortChange($event: Sort) {
    const sort = (
      a: ObjectFromList<SheetColumns, number | string | any>,
      b: ObjectFromList<SheetColumns, number | string | any>,
      sort: Sort,
    ) => {
      switch (sort.direction) {
        case 'asc':
          if (typeof a[sort.active] === 'string') {
            return a[sort.active]
              .toLowerCase()
              .localeCompare(b[sort.active].toLowerCase());
          } else if (typeof a[sort.active] === 'number') {
            return b[sort.active] - a[sort.active];
          }
          return;
        case 'desc':
          if (typeof a[sort.active] === 'string') {
            return b[sort.active]
              .toLowerCase()
              .localeCompare(a[sort.active].toLowerCase());
          } else if (typeof a[sort.active] === 'number') {
            return a[sort.active] - b[sort.active];
          }
          return;
        default:
          return;
      }
    };
    if ($event.direction === '') {
      this.tableData.set(this.rawData);
    }
    this.tableData.mutate((data) => {
      return data.sort((a, b) => sort(a, b, $event));
    });
    this.matTable?.renderRows();
  }
}
