import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtInterceptor } from '../core/interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// Ensure it looks exactly like this:
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideHttpClient(),      // Essential for API calls
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule)       // Essential for Angular Material
  ]
};