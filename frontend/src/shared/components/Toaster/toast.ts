import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Disappears after 3 seconds
      horizontalPosition: 'end', // Top right or bottom right
      verticalPosition: 'top',
      panelClass: ['success-snackbar'] // Custom CSS class for styling
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000, // Errors stay a bit longer
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'] // Custom CSS class for styling
    });
  }
}