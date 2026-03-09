import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent {
  form: any = { email: null, password: null };
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.form).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data.user);
        this.router.navigate(['/']); // Redirect to home or dashboard
      },
      error: err => {
        this.errorMessage = err.error.message || 'Login failed';
      }
    });
  }
}