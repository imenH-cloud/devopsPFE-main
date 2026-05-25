import { Component, OnInit } from '@angular/core';
import { ActivityService, Activity } from './activity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  standalone: false
})
export class ActivityComponent implements OnInit {
  activities: Activity[] = [];
  showForm = false;
  activityForm!: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private activityService: ActivityService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadActivities();
    this.initializeForm();
  }

  initializeForm(): void {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      studentId: ['', Validators.required],
      type: ['', Validators.required],
      date: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des activités';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.activityForm.invalid) return;
    
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.activityService.create(this.activityForm.value).subscribe({
      next: (activity) => {
        this.success = `Activité "${activity.title}" créée avec succès!`;
        this.activityForm.reset();
        this.showForm = false;
        this.loadActivities();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.activityForm.reset();
      this.error = '';
    }
  }

  deleteActivity(id: number): void {
    if (confirm('Êtes-vous sûr?')) {
      this.activityService.delete(id).subscribe({
        next: () => {
          this.success = 'Activité supprimée!';
          this.loadActivities();
        },
        error: (err: any) => this.error = 'Erreur lors de la suppression'
      });
    }
  }
}
