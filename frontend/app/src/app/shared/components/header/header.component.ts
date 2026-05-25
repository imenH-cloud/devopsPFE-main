import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemeService } from '../services/theme.service';
import { RealtimeService } from '../services/realtime.service';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <div class="toolbar-content">
        <div class="logo">
          <img src="assets/logo.png" alt="DevOps Education" />
          <span>DevOps Education</span>
        </div>

        <div class="spacer"></div>

        <div class="toolbar-actions">
          <!-- Notifications -->
          <button
            mat-icon-button
            [matBadge]="notificationCount"
            matBadgeColor="accent"
            [matMenuTriggerFor]="notificationsMenu"
          >
            <mat-icon>notifications</mat-icon>
          </button>
          <mat-menu #notificationsMenu="matMenu" class="notifications-menu">
            <div class="notification-list" *ngFor="let notif of notifications">
              <button mat-menu-item [disabled]="true">
                <mat-icon [ngClass]="'notif-' + notif.type"
                  >{{ getNotificationIcon(notif.type) }}</mat-icon
                >
                <span>{{ notif.message }}</span>
              </button>
            </div>
          </mat-menu>

          <!-- Real-time Status -->
          <button
            mat-icon-button
            [class.connected]="isConnected$ | async"
            matTooltip="{{ (isConnected$ | async) ? 'Connecté' : 'Hors ligne' }}"
          >
            <mat-icon
              class="pulse"
              *ngIf="(isConnected$ | async); else offlineIcon"
              >cloud_done</mat-icon
            >
            <ng-template #offlineIcon>
              <mat-icon>cloud_off</mat-icon>
            </ng-template>
          </button>

          <!-- Theme Toggle -->
          <button
            mat-icon-button
            (click)="toggleTheme()"
            [attr.aria-label]="'Toggle ' + (currentTheme$ | async) + ' theme'"
          >
            <mat-icon *ngIf="(currentTheme$ | async) === 'light'"
              >dark_mode</mat-icon
            >
            <mat-icon *ngIf="(currentTheme$ | async) === 'dark'"
              >light_mode</mat-icon
            >
          </button>

          <!-- User Menu -->
          <button
            mat-icon-button
            [matMenuTriggerFor]="userMenu"
            matTooltip="Menu Utilisateur"
          >
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>Mon Profil</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>Paramètres</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      .app-toolbar {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .toolbar-content {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 100%;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;
        font-weight: 500;
      }

      .logo img {
        height: 32px;
        width: auto;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .notification-list {
        min-width: 300px;
        padding: 8px 0;
      }

      .notif-success {
        color: #4caf50;
      }

      .notif-error {
        color: #f44336;
      }

      .notif-warning {
        color: #ff9800;
      }

      .notif-info {
        color: #2196f3;
      }

      .connected {
        color: #4caf50;
      }

      .pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  currentTheme$: Observable<string>;
  isConnected$: Observable<boolean>;
  notifications: any[] = [];
  notificationCount = 0;

  constructor(
    private themeService: ThemeService,
    private realtimeService: RealtimeService,
    private notificationService: NotificationService,
  ) {
    this.currentTheme$ = this.themeService.theme$;
    this.isConnected$ = this.realtimeService.isConnected$;
  }

  ngOnInit() {
    this.notificationService.notifications$.subscribe((notif) => {
      this.notifications.unshift(notif);
      this.notificationCount = Math.min(this.notifications.length, 99);

      // Keep only last 10 notifications in menu
      if (this.notifications.length > 10) {
        this.notifications = this.notifications.slice(0, 10);
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };
    return icons[type] || 'notifications';
  }

  logout() {
    // TODO: Implement logout
    this.notificationService.info('Déconnexion en cours...');
  }
}
