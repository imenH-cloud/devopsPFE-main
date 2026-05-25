import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteComponent } from './delete/delete.component';
@NgModule({
  declarations: [
    LoginComponent,
  DeleteComponent,
  
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,FormsModule,ReactiveFormsModule,
  ]

})
export class AuthModule { }
