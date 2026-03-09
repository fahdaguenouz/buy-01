import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';
import { ToasterService } from '../../../shared/components/Toaster/toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  roles = [UserRole.CLIENT, UserRole.SELLER]; // Loaded from our model

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
        private toast: ToasterService
    
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.CLIENT, Validators.required] // Default role
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.toast.showSuccess('Registration successful!'); // Show success toast
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Registration failed';
          this.errorMessage = errorMsg;
          this.toast.showError(errorMsg);
        }
      });
    }
  }
}