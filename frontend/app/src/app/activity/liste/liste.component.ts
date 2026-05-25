import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-liste',
  standalone: false,
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
})
export class ListeComponent implements OnInit, AfterViewInit {
  activities: any[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  ngAfterViewInit(): void {
    // Recharge après navigation
    setTimeout(() => this.loadActivities(), 100);
  }

  loadActivities(): void {
    this.loading = true;
    this.activityService.getAll().subscribe({
      next: (data: any) => {
        this.activities = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités:', err);
        this.error = 'Impossible de charger les activités';
        this.loading = false;
      }
    });
  }

  add(): void {
    this.router.navigate(['/activity/add']);
  }

  edit(id: number): void {
    this.router.navigate(['/activity/edit', id]);
  }

  delete(id: number): void {
    // Pour la soutenance
  }
}
