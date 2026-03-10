import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MediaService } from '../../services/media.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { ToasterService } from '../../shared/components/Toaster/toast';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ProfileUpdateDialogComponent } from './update/update.profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
    private mediaService: MediaService,
    private userService: UserService,
    private authService: AuthService,
    private toast: ToasterService,
  ) {}

 ngOnInit(): void {
    // 1. Keep the subscription to get immediate basic data (like role/username)
    this.authService.currentUser$.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    // 2. Fetch the FULL profile from the backend to get the email, firstName, etc.
    this.userService.getProfile().subscribe({
      next: (fullProfile) => {
        // Merge the basic JWT data with the full database data
        const mergedUser = { ...this.user, ...fullProfile };
        this.user = mergedUser as User;
        
        // Update the global state so the Navbar gets the fresh data too!
        this.authService.setLoggedInUser(this.user);
      },
      error: (err) => {
        console.error('Failed to fetch full profile:', err);
        this.toast.showError('Could not load complete profile data.');
      }
    });
  }

  openUpdateDialog() {
    const dialogRef = this.dialog.open(ProfileUpdateDialogComponent, {
      width: '400px',
      data: this.user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.processUpdate(result);
      }
    });
  }

private processUpdate(result: any) {
    if (result.file) {
      this.mediaService.uploadImage(result.file).subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            // 🔥 FIX 1: Send the fileName (ID), not the full URL
            const fileName = res[0].fileName; 
            this.finalizeUpdate(result, fileName);
          }
        },
        error: (err) => {
          this.toast.showError('Image upload failed');
        },
      });
    } else {
      this.finalizeUpdate(result);
    }
  }

  private finalizeUpdate(formValues: any, fileName?: string) {
    const payload = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      // 🔥 FIX 2: Use 'avatarMediaId' to match your Spring DTO
      ...(fileName && { avatarMediaId: fileName }), 
    };

    this.userService.updateProfile(payload).subscribe({
      next: (updated: any) => {
        // Updated will now have the full URL thanks to your mapToResponse logic
        this.authService.setLoggedInUser({ ...this.user, ...updated });
        this.toast.showSuccess('Profile updated!');
      },
    });
  }
}
