import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ListeComponent } from './liste/liste.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full' },
  {path:'add',component:AddComponent},
  {path:'list',component:ListeComponent},
  {path: 'edit/:id', component: UpdateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
