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
import { UserComponent } from './components/user/user.component';
import { WorkerComponent } from './components/worker/worker.component';

const routes: Routes = [
  {path: '/', component: HomeComponent},
  {path: '/admin', component: AdminComponent},
  {path: '/changepass', component: ChangepassComponent},
  {path: '/document', component: DocumentComponent},
  {path: '/employee', component: EmployeeComponent},
  {path: '/forgottenpass', component: ForgottenpassComponent},
  {path: '/resetpass', component: ResetpassComponent},
  {path: '/secretquestion', component: SecretquestionComponent},
  {path: '/subject', component: SubjectComponent},
  {path: '/user', component: UserComponent},
  {path: '/worker', component: WorkerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
