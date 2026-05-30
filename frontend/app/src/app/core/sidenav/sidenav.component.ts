import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.css',
    standalone: false
})
export class SidenavComponent implements OnInit {
  currentUser: any;

  ngOnInit() {
    // Récupérer l'utilisateur depuis localStorage ou session
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  getProfileImageUrl(): string {
    // Si l'utilisateur a une photo, retourner son URL
    if (this.currentUser?.picture) {
      return this.currentUser.picture;
    }
    // Sinon, utiliser un avatar avec initiales
    if (this.currentUser?.firstName && this.currentUser?.lastName) {
      const initials = (this.currentUser.firstName[0] + this.currentUser.lastName[0]).toUpperCase();
      return `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }
    // Fallback à un avatar générique
    return 'https://ui-avatars.com/api/?name=Admin&background=3B82F6';
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}
