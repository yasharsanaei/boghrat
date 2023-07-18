export interface ExcelDoc<T> {
  id: string;
  name: string;
  sheets: ExcelSheet<T>;
  numberOfSheets: number;
}

export interface ExcelSheet<T> {
  [key: string]: T[];
}
