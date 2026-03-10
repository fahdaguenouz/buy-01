import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';
import { ToasterService } from '../../shared/components/Toaster/toast';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private toast: ToasterService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // If the backend rejects the token (or it's faked/expired)
        if ([401, 403].includes(err.status)) {
          this.tokenStorage.signOut(); // Clear the fake/expired token
          this.toast.showError('Session expired or invalid. Please log in again.');
          
          // Force a hard redirect to login
          window.location.href = '/login'; 
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
    );
  }
}