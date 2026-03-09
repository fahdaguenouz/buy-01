import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (data) => {
          console.log('Backend Response:', data); // <--- Check if it's 'data.user' or just 'data'
          this.tokenStorage.saveToken(data.token);

          // If your backend returns { token: '...', id: 1, email: '...' }
          // without a nested 'user' object, use 'data' directly:
          this.tokenStorage.saveUser(data.user || data);

          // Navigate to /products explicitly to ensure the guard catches it
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Check your credentials.';
        },
      });
    }
  }
}
