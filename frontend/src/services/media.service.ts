import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // The backend expects a multipart form-data part named 'file'

    // Your Gateway routes /media to the Media Service
    return this.http.post(`${environment.gatewayUrl}/media/images`, formData);
  }
}