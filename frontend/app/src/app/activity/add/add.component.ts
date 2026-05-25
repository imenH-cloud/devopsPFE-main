import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivityService } from '../activity.service';
import { ClassroomService } from '../../classroom/classroom.service';
import { ActivityType } from '../activity';

@Component({
  selector: 'app-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  activityForm: FormGroup;
  submitted = false;
  loading = false;
  classrooms: any[] = [];
  activityTypes = Object.values(ActivityType);
  showError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private classroomService: ClassroomService,
    private router: Router
  ) {
    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      type: [ActivityType.OTHER, Validators.required],
      description: ['', Validators.required],
      location: [''],
      date: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      isCompleted: [false],
      classroomId: ['', Validators.required],
      metadata: this.fb.group({
        resources: [''],
        attachments: [''],
        comments: ['']
      })
    });
  }

  ngOnInit(): void {
    console.log('✅ AddComponent initialized');
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    console.log('📡 Loading classrooms...');
    this.classroomService.findAll().subscribe({
      next: (res: any) => {
        console.log('✅ Classrooms loaded:', res);
        this.classrooms = res;
      },
      error: (err) => {
        console.error('❌ Error loading classrooms:', err);
        this.showError = true;
        this.errorMessage = 'Erreur lors du chargement des salles';
      }
    });
  }

  get f() {
    return this.activityForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('✅ Form submitted');
    console.log('Form status:', this.activityForm.status);
    console.log('Form value:', this.activityForm.value);

    if (this.activityForm.invalid) {
      console.error('❌ Form invalid');
      this.showError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      for (const control in this.activityForm.controls) {
        const c = this.activityForm.get(control);
        if (c && c.invalid) {
          console.error(`Field ${control} invalid:`, c.errors);
        }
      }
      return;
    }

    this.loading = true;
    this.showError = false;
    const formValue = this.activityForm.value;
    console.log('📡 Envoi des données:', formValue);

    const activityPayload = {
      name: formValue.name,
      type: formValue.type,
      description: formValue.description,
      location: formValue.location,
      date: formValue.date,
      duration: formValue.duration,
      isCompleted: formValue.isCompleted,
      classroomId: formValue.classroomId,
      metadata: {
        resources: formValue.metadata.resources?.split(',').map((r: string) => r.trim()) || [],
        attachments: formValue.metadata.attachments?.split(',').map((a: string) => a.trim()) || [],
        comments: formValue.metadata.comments || ''
      }
    };

    console.log('📡 Payload de l\'activité:', activityPayload);

    this.activityService.create(activityPayload).subscribe({
      next: () => {
        console.log('✅ Activité créée avec succès');
        this.loading = false;
        this.router.navigate(['/activity']);
      },
      error: (err) => {
        console.error('❌ Erreur de création:', err);
        this.loading = false;
        this.showError = true;
        this.errorMessage = err?.error?.message || 'Erreur lors de la création de l\'activité';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/activity']);
  }
}
