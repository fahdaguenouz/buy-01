import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from '../features/auth/auth.module';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true, // Ensure this is true
  imports: [RouterOutlet, AuthModule,SharedModule], // Add AuthModule here
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('01buy Frontend');
}