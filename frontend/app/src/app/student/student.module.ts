import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AddStudentComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    AddStudentComponent,
    UpdateComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class StudentModule { }
