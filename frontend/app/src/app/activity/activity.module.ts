import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importer les composants standalone
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { ListeComponent } from './liste/liste.component';

@NgModule({
  declarations: [
    AddComponent,
    UpdateComponent,
    ListeComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
 
  ]
})
export class ActivityModule { }

