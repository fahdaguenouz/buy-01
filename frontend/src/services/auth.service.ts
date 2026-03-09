import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthResponse } from '../models/user.model';


const AUTH_API = `${environment.gatewayUrl}/auth/`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_API + 'login', {
      identifier: credentials.username,
      password: credentials.password
    });
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role // CLIENT or SELLER
    });
  }
}