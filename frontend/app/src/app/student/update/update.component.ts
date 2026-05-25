import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
    selector: 'app-update-student',
    templateUrl: './update.component.html',
    standalone: false
})
export class UpdateComponent implements OnInit {
  studentForm: FormGroup;
  submitted = false;
  studentId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {
  this.studentForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
      ]],
      numeroInscriptio: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{3}\d{4}\d{3}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      parentId: [''],
      classroomId: ['']
    });
  }

  ngOnInit(): void {
    this.studentId = +this.route.snapshot.params['id'];
    this.loadStudent();
  }

  loadStudent(): void {
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
      },
      error: (error) => {
        console.error('Error loading student:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.valid) {
      this.studentService.updateStudent(this.studentId, this.studentForm.value).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (error) => {
          console.error('Error updating student:', error);
        }
      });
    }
  }

  get f() { return this.studentForm.controls; }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
