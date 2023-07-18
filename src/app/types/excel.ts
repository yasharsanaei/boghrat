export interface ExcelDoc<T> {
  id: string;
  name: string;
  sheets: ExcelSheet<T>;
}

export interface ExcelSheet<T> {
  [key: string]: T[];
}
