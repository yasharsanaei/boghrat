import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
  ) {
    this.form = this.formBuilder.group({
      file: ['', [Validators.required]],
      fileSource: ['', Validators.required],
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.documentService.loadFile(this.form.controls['fileSource'].value);
  }

  onFileChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.form.patchValue({
        fileSource: target.files[0],
      });
    }
  }
}
