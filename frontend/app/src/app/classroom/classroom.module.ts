import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassroomRoutingModule } from './classroom-routing.module';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddComponent,
    UpdateComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ClassroomRoutingModule,FormsModule,ReactiveFormsModule
  ]
})
export class ClassroomModule { }
