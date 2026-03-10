import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile-update-dialog',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  standalone: false
})
export class ProfileUpdateDialogComponent implements OnInit {
  updateForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.updateForm = this.fb.group({
      firstName: [data.firstName],
      lastName: [data.lastName]
    });
    this.avatarPreview = data.avatarUrl || '/images/default-avatar.png';
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024 && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    // Send back the form values and the file if selected
    this.dialogRef.close({
      ...this.updateForm.value,
      file: this.selectedFile
    });
  }
}