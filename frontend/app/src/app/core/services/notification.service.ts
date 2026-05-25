import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  public notifications$ = this.notificationsSubject.asObservable();
  private notifications: Notification[] = [];

  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Succès') {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
    this.addNotification('success', message);
  }

  error(message: string, title: string = 'Erreur') {
    this.toastr.error(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right',
    });
    this.addNotification('error', message);
  }

  warning(message: string, title: string = 'Attention') {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
    });
    this.addNotification('warning', message);
  }

  info(message: string, title: string = 'Information') {
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
    this.addNotification('info', message);
  }

  private addNotification(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    data?: any,
  ) {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
      data,
    };
    this.notifications.push(notification);
    this.notificationsSubject.next(notification);

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications.shift();
    }
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }
}
