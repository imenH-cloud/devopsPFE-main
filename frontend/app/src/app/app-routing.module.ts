import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboard', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), canActivate: [AuthGuard] },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },
  { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule), canActivate: [AuthGuard] },
  { path: 'parent', loadChildren: () => import('./parent/parent.module').then(m => m.ParentModule), canActivate: [AuthGuard] },
  { path: 'classroom', loadChildren: () => import('./classroom/classroom.module').then(m => m.ClassroomModule), canActivate: [AuthGuard] },
  { path: 'activity', loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule), canActivate: [AuthGuard] },
  { path: 'teacher', loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule), canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
