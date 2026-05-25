import { Component } from '@angular/core';
import { ClassroomService } from '../classroom.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    standalone: false
})
export class ListComponent {

  classrooms: any[] = [];
  filteredClassrooms: any[] = [];
  selectedClassrooms: number[] = [];
  searchTerm = '';
  gradeFilter = '';
  specializationFilter = '';
  yearFilter = '';
  loading = false;
  uniqueGrades: string[] = [];
  uniqueSpecializations: string[] = [];
  uniqueAcademicYears: string[] = [];

  constructor(
    private classroomService: ClassroomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.loading = true;
    this.classroomService.findAll().subscribe({
      next: (classrooms) => {
        this.classrooms = classrooms;
        this.filteredClassrooms = classrooms;
        this.extractUniqueValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading classrooms:', error);
        this.loading = false;
      }
    });
  }

  extractUniqueValues(): void {
    this.uniqueGrades = [...new Set(this.classrooms
        .map(c => c.grade)
        .filter(grade => grade)) as unknown as string[]];
      
    this.uniqueSpecializations = [...new Set(this.classrooms
        .map(c => c.Specialization)
        .filter(spec => spec)) as unknown as string[]];

    this.uniqueAcademicYears = [...new Set(this.classrooms
        .map(c => c.academicYear)
        .filter(year => year)) as unknown as string[]];
  }

  filterClassrooms(): void {
    this.filteredClassrooms = this.classrooms.filter(classroom => {
      const matchesSearch = !this.searchTerm || 
        classroom.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classroom.grade.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classroom.Specialization.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classroom.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesGrade = !this.gradeFilter || classroom.grade === this.gradeFilter;
      const matchesSpecialization = !this.specializationFilter || classroom.Specialization === this.specializationFilter;
      const matchesYear = !this.yearFilter || classroom.academicYear === this.yearFilter;

      return matchesSearch && matchesGrade && matchesSpecialization && matchesYear;
    });
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedClassrooms = this.filteredClassrooms.map(classroom => classroom.id);
    } else {
      this.selectedClassrooms = [];
    }
  }

  toggleClassroomSelection(classroomId: number, event: any): void {
    if (event.target.checked) {
      this.selectedClassrooms.push(classroomId);
    } else {
      this.selectedClassrooms = this.selectedClassrooms.filter(id => id !== classroomId);
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/classroom/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/classroom/update', id]);
  }

  viewClassroom(id: number): void {
    this.router.navigate(['/classroom/view', id]);
  }

  deleteClassroom(id: number): void {
    if (confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) {
      this.classroomService.remove(id).subscribe({
        next: () => {
          this.loadClassrooms();
        },
        error: (error) => {
          console.error('Error deleting classroom:', error);
          alert('Error deleting classroom. Please try again.');
        }
      });
    }
  }

  deleteSelected(): void {
    // if (confirm(`Are you sure you want to delete ${this.selectedClassrooms.length} selected classrooms? This action cannot be undone.`)) {
    //   this.classroomService.deleteMultipleClassrooms(this.selectedClassrooms).subscribe({
    //     next: () => {
    //       this.selectedClassrooms = [];
    //       this.loadClassrooms();
    //     },
    //     error: (error) => {
    //       console.error('Error deleting classrooms:', error);
    //       alert('Error deleting classrooms. Please try again.');
    //     }
    //   });
    // }
  }
}

