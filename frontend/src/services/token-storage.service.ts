import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth-token';

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(this.TOKEN_KEY);
  }

  // 🔥 NEW: Decode the JWT to get the user data safely
  public getUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // A JWT has 3 parts separated by dots. The middle part is the data.
      const payload = token.split('.')[1];
      const decodedJson = atob(payload); // Decode Base64
      const decodedData = JSON.parse(decodedJson);

      // Map the JWT claims to your User model
      // Note: Adjust 'sub' and 'role' if your Spring Boot JWT uses different claim names
      return {
        username: decodedData.sub || decodedData.username,
        role: decodedData.role || decodedData.roles || 'CLIENT',
        email: decodedData.email || '',
      } as User;

    } catch (e) {
      // If the user pastes a fake token that can't be decoded, return null
      return null; 
    }
  }
}