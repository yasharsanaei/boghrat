import { Injectable } from '@angular/core';
import { read, utils, WorkBook } from 'xlsx';
import { v4 as uuidV4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { ExcelDoc, ExcelSheet } from '../types/excel';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents$: BehaviorSubject<ExcelDoc<unknown>[]>;

  constructor() {
    this.documents$ = new BehaviorSubject<ExcelDoc<unknown>[]>(
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
      const sheets: ExcelSheet<unknown> = {};
      Object.keys(workBook.Sheets).forEach((key) => {
        sheets[key] = utils.sheet_to_json(workBook.Sheets[key]);
      });

      this.addDocument({ id: uuidV4(), name: file.name, sheets: sheets });
    };
  }

  private addDocument(newDoc: ExcelDoc<unknown>) {
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
    return JSON.parse(docs) as ExcelDoc<unknown>[];
  }

  getDocumentById(id: string) {
    return this.documents$.value.find((d) => d.id === id);
  }
}
