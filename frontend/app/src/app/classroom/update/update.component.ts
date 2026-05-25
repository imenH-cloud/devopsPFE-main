import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassroomService } from '../classroom.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrl: './update.component.css',
    standalone: false
})
export class UpdateComponent {
    classroomForm: FormGroup;
  classroomId: number = 0;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private router: Router
  ) {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      grade: ['', Validators.required],
      academicYear: ['', Validators.required],
      description: [''],
      isActive: [true],
      location: ['', Validators.required],
      Specialization: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.classroomId = +this.route.snapshot.paramMap.get('id')!;
    this.loadClassroom();
  }

  loadClassroom(): void {
    this.classroomService.findOne(this.classroomId).subscribe({
      next: (data) => {
        this.classroomForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error loading classroom:', err);
      }
    });
  }

  get f() {
    return this.classroomForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // if (this.classroomForm.invalid) {
    //   return;
    // }

    const updatedData = { ...this.classroomForm.value, id: this.classroomId };

    this.classroomService.update(this.classroomId, updatedData).subscribe({
      next: () => {
        this.router.navigate(['/classroom']);
      },
      error: (error) => {
        console.error('Error updating classroom:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/classroom']);
  }

}
