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
        console.log('Backend Response:', data); 
        
        // 1. Determine the actual user object (handles both nested and flat responses)
        const currentUser = data.user || data; 

        // 2. Save token and user to local storage
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(currentUser);
        
        // 3. Trigger the BehaviorSubject with the EXACT same object
        this.authService.setLoggedInUser(currentUser);
        
        // 4. Navigate away
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Check your credentials.';
      },
    });
  }
}
}
