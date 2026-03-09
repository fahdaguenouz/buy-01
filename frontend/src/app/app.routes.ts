import { Routes } from '@angular/router';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';


export const routes: Routes = [
  // 1. Authentication Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // 2. Default Redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // 3. Catch-all (Wildcard) - redirects any unknown URL to login
  { path: '**', redirectTo: '/login' }
];