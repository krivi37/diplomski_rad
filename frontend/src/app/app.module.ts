import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { ResetpassComponent } from './components/resetpass/resetpass.component';
import { SecretquestionComponent } from './components/secretquestion/secretquestion.component';
import { ForgottenpassComponent } from './components/forgottenpass/forgottenpass.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { WorkerComponent } from './components/worker/worker.component';
import { UserComponent } from './components/user/user.component';
import { DocumentComponent } from './components/document/document.component';
import { SubjectComponent } from './components/subject/subject.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChangepassComponent,
    ResetpassComponent,
    SecretquestionComponent,
    ForgottenpassComponent,
    AdminComponent,
    EmployeeComponent,
    WorkerComponent,
    UserComponent,
    DocumentComponent,
    SubjectComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
