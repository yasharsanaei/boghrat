import { Injectable } from '@angular/core';
import { read, utils, WorkBook } from 'xlsx';
import { v4 as uuidV4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { ExcelDoc, ExcelSheet } from '../types/excel';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents$: BehaviorSubject<ExcelDoc[]>;

  constructor() {
    this.documents$ = new BehaviorSubject<ExcelDoc[]>(
      this.readDocumentsFromLocalStorage() || [],
    );
  }

  loadFile(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = () => {
      const workBook: WorkBook = read(fileReader.result, {
        type: 'buffer',
      });
      const sheets: ExcelSheet[] = [];

      Object.keys(workBook.Sheets).forEach((key) => {
        sheets.push({
          name: key,
          columns: Object.keys(
            utils.sheet_to_json(workBook.Sheets[key]).at(0) || {},
          ),
          data: utils.sheet_to_json(workBook.Sheets[key]),
        });
      });

      this.addDocument({
        id: uuidV4(),
        name: file.name,
        sheets: sheets,
        numberOfSheets: Object.keys(sheets).length,
      });
    };
  }

  private addDocument(newDoc: ExcelDoc) {
    const docs = this.documents$.value;
    this.documents$.next([...docs, newDoc]);
    this.writeDocumentsToLocalStorage();
  }

  removeDocument(id: string) {
    const docs = this.documents$.value;
    const index = docs.findIndex((d) => d.id === id);
    if (!index) return;
    docs.splice(index, 1);
    this.documents$.next([...docs]);
    this.writeDocumentsToLocalStorage();
  }

  private writeDocumentsToLocalStorage() {
    const docs = this.documents$.value;
    localStorage.setItem('documents$', JSON.stringify(docs));
  }

  private readDocumentsFromLocalStorage() {
    const docs = localStorage.getItem('documents$');
    if (docs === null) return undefined;
    return JSON.parse(docs) as ExcelDoc[];
  }
}
