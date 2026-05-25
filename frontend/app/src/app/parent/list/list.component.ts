import { Component } from '@angular/core';
import { Parent } from '../parent';
import { ParentService } from '../parent.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    standalone: false
})
export class ListComponent {
parents: Parent[] = [];
  filteredParents: Parent[] = [];
  selectedParents: number[] = [];
  searchTerm = '';
  jobFilter = '';
  insuranceFilter = '';
  loading = false;
  uniqueJobs: string[] = [];
  uniqueInsuranceTypes: string[] = [];

  constructor(
    private parentService: ParentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents(): void {
    this.loading = true;
    this.parentService.getParents().subscribe({
      next: (parents) => {
        this.parents = parents;
        this.filteredParents = parents;
        this.extractUniqueValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading parents:', error);
        this.loading = false;
      }
    });
  }

  extractUniqueValues(): void {
    this.uniqueJobs = [...new Set(this.parents.map(p => p.job).filter(job => job))];
    this.uniqueInsuranceTypes = [...new Set(this.parents.map(p => p.typeInsurance).filter(type => type))];
  }

  filterParents(): void {
    this.filteredParents = this.parents.filter(parent => {
      const matchesSearch = !this.searchTerm || 
        parent.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        parent.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        parent.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        parent.phoneNumber.includes(this.searchTerm);
      
      const matchesJob = !this.jobFilter || parent.job === this.jobFilter;
      const matchesInsurance = !this.insuranceFilter || parent.typeInsurance === this.insuranceFilter;

      return matchesSearch && matchesJob && matchesInsurance;
    });
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedParents = this.filteredParents.map(parent => parent.id);
    } else {
      this.selectedParents = [];
    }
  }

  toggleParentSelection(parentId: number, event: any): void {
    if (event.target.checked) {
      this.selectedParents.push(parentId);
    } else {
      this.selectedParents = this.selectedParents.filter(id => id !== parentId);
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/parent/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/parent/update', id]);
  }

  viewParent(id: number): void {
    this.router.navigate(['/parent/view', id]);
  }

  deleteParent(id: number): void {
    if (confirm('Are you sure you want to delete this parent? This action cannot be undone.')) {
      this.parentService.deleteParent(id).subscribe({
        next: () => {
          this.loadParents();
        },
        error: (error) => {
          console.error('Error deleting parent:', error);
          alert('Error deleting parent. Please try again.');
        }
      });
    }
  }

  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedParents.length} selected parents? This action cannot be undone.`)) {
      this.parentService.deleteMultipleParents(this.selectedParents).subscribe({
        next: () => {
          this.selectedParents = [];
          this.loadParents();
        },
        error: (error) => {
          console.error('Error deleting parents:', error);
          alert('Error deleting parents. Please try again.');
        }
      });
    }
  }

}
