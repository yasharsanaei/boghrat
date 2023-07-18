export interface ExcelDoc<T = object> {
  id: string;
  name: string;
  sheets: ExcelSheet<T>[];
  numberOfSheets: number;
}

export type ObjectFromList<
  keys extends ReadonlyArray<string>,
  objectValues = object,
> = {
  [K in keys extends ReadonlyArray<infer U> ? U : never]: objectValues;
};

export type SheetColumns = string[];

export interface ExcelSheet<T = object> {
  name: string;
  columns: SheetColumns;
  data: ObjectFromList<SheetColumns, T>[];
}
