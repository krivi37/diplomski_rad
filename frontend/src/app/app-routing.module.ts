import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { DocumentComponent } from './components/document/document.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { ForgottenpassComponent } from './components/forgottenpass/forgottenpass.component';
import { HomeComponent } from './components/home/home.component';
import { ResetpassComponent } from './components/resetpass/resetpass.component';
import { SecretquestionComponent } from './components/secretquestion/secretquestion.component';
import { SubjectComponent } from './components/subject/subject.component';
import { WorkerComponent } from './components/worker/worker.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'admin', component: AdminComponent, data:{allowedRoles: 'admin'}, canActivate: [AuthGuardService]},
  {path: 'changepass', component: ChangepassComponent, data:{allowedRoles: ['employee', 'worker', 'admin']}, canActivate: [AuthGuardService]},
  {path: 'document', component: DocumentComponent, data:{allowedRoles: ['employee', 'worker']}, canActivate: [AuthGuardService]},
  {path: 'employee', component: EmployeeComponent, data:{allowedRoles: 'employee'}, canActivate: [AuthGuardService]},
  {path: 'forgottenpass', component: ForgottenpassComponent},
  {path: 'resetpass', component: ResetpassComponent},
  {path: 'secretquestion', component: SecretquestionComponent},
  {path: 'subject', component: SubjectComponent, data:{allowedRoles: ['employee', 'worker']}, canActivate: [AuthGuardService]},
  {path: 'worker', component: WorkerComponent, data:{allowedRoles: 'worker'}, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
