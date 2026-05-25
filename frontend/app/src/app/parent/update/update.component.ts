import { Component, OnInit } from '@angular/core';
import { CreateParentDto } from '../parent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ParentService } from '../parent.service';
@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrl: './update.component.css',
    standalone: false
})
export class UpdateComponent implements OnInit {
goBack() {
throw new Error('Method not implemented.');
}

    parentForm: FormGroup;
    submitted = false;
  id!: number;
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private parentService: ParentService ,
      private activeRouter:ActivatedRoute
    ) {
      this.parentForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        NCIN: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        address: ['', Validators.required],
        typeInsurance: ['', Validators.required],
        Numeroinsurance: ['', Validators.required],
        job: ['', Validators.required]
      });
    }
     ngOnInit(): void {   
         this.activeRouter.params.subscribe(async (params: Params) => {
            this.id = +params['id'];
             await this.getUserById(this.id)
      
          });
        }
            
     
      getUserById(id:number){
  this.parentService.getParentById(id).subscribe(data=>{

   this.parentForm.patchValue({
          firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber:data.phoneNumber,
        NCIN: data.NCIN,
        address: data.address,
        typeInsurance: data.typeInsurance,
        Numeroinsurance: data.Numeroinsurance,
        job: data.job
          });
  })
 
  
}
    onSubmit(): void {
      this.submitted = true;
     
        const parentData: CreateParentDto = this.parentForm.value;
        this.parentService.updateParent(this.id, parentData).subscribe({
          next: () => {
            console.log('Parent updated successfully');
            this.router.navigate(['/parent']);
          },
          error: (err) => {
            console.error('Error updating parent:', err);
          }
        });
      
    }
  
    get f() { return this.parentForm.controls; }
  
    onCancel(): void {
      this.router.navigate(['/parents']);
    }
}
