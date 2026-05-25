import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';
import { tokenGetter } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'front';
  userMenuOpen = false;
  
  // User info
  userName = 'IMEN HAMADA';
  userEmail = 'admin@school.com';
  userPhoto = 'https://firebasestorage.googleapis.com/v0/b/devopspfe-6ac57.appspot.com/o/imen-profile.jpg?alt=media'; // Replace with your photo URL

  constructor(private router: Router,
        @Inject(PLATFORM_ID) private platformId: object
  )
  {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
          initFlowbite();
      }
      if (isPlatformBrowser(this.platformId)) {
        document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('csrftoken');
      }
      
      // Close menu when route changes
      this.router.events.subscribe(() => {
        this.userMenuOpen = false;
      });
  }

  isAuthenticated(): boolean {
    return tokenGetter(this.platformId).length > 0;
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/auth/login') || this.router.url === '/auth';
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    // Clear token from cookies and localStorage
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      localStorage.removeItem('token');
      localStorage.removeItem('csrftoken');
    }
    this.userMenuOpen = false;
    this.router.navigate(['/auth/login']);
  }
}
