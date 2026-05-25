import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DeleteComponent } from './delete/delete.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "delete",
    component: DeleteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
