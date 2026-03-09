import { Routes } from '@angular/router';
import { LoginComponent } from '../features/auth/login/login.component';
import { NoAuthGuard } from '../core/guards/no-auth.guard';
import { RegisterComponent } from '../features/auth/register/register.component';
import { AuthGuard } from '../core/guards/auth.guard';


export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [NoAuthGuard] // If logged in, go to home
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
    canActivate: [NoAuthGuard] 
  },
  
  // Example of a protected route we will build soon
  { 
    path: 'products', 
    component: ProductListComponent, // Placeholder for now
    canActivate: [AuthGuard] 
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];