import { Component } from '@angular/core';
import { ActivityType } from '../activity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityService } from '../activity.service';
import { ClassroomService } from '../../classroom/classroom.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update',
standalone: false,

  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
  activityForm: FormGroup;
  submitted = false;
  classrooms: any[] = [];
  activityTypes = Object.values(ActivityType);
  isEditMode = false;
  activityId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private classroomService: ClassroomService,
    private router: Router,
    private route: ActivatedRoute
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
    this.classroomService.findAll().subscribe({
      next: (res: any) => (this.classrooms = res),
      error: (err) => console.error('Error loading classrooms:', err)
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.activityId = +idParam;
        this.loadActivity(this.activityId);
      }
    });
  }

  loadActivity(id: number): void {
    this.activityService.getById(id).subscribe({
      next: (activity) => {
        this.activityForm.patchValue({
          name: activity.name,
          type: activity.type,
          description: activity.description,
          location: activity.location,
          date: activity.date,
          duration: activity.duration,
          isCompleted: activity.isCompleted,
          classroomId: activity.classroom?.id,
          metadata: {
            resources: activity.metadata?.resources?.join(',') || '',
            attachments: activity.metadata?.attachments?.join(',') || '',
            comments: activity.metadata?.comments || ''
          }
        });
      },
      error: (err) => console.error('Error loading activity:', err)
    });
  }

  get f() {
    return this.activityForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    const formValue = this.activityForm.value;
    const activityPayload = {
      ...formValue,
      metadata: {
        resources: formValue.metadata.resources?.split(',') || [],
        attachments: formValue.metadata.attachments?.split(',') || [],
        comments: formValue.metadata.comments || ''
      },
      classroom: formValue.classroomId
    };
    if (this.isEditMode && this.activityId) {
      this.activityService.update(this.activityId, activityPayload).subscribe({
        next: () => this.router.navigate(['/activity']),
        error: (err) => console.error('Error updating activity:', err)
      });
    } else {
      this.activityService.create(activityPayload).subscribe({
        next: () => this.router.navigate(['/activity']),
        error: (err) => console.error('Error creating activity:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/activity']);
  }

}
