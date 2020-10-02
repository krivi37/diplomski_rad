import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";
import { MomentModule } from 'ngx-moment';

import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ChangepassComponent } from './components/changepass/changepass.component';
import { ResetpassComponent } from './components/resetpass/resetpass.component';
import { SecretquestionComponent } from './components/secretquestion/secretquestion.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { WorkerComponent } from './components/worker/worker.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ForgottenpassComponent } from './components/forgottenpass/forgottenpass.component';
import { DocumentComponent } from './components/document/document.component';
import { SubjectComponent } from './components/subject/subject.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChangepassComponent,
    ResetpassComponent,
    SecretquestionComponent,
    AdminComponent,
    EmployeeComponent,
    WorkerComponent,
    NavbarComponent,
    ForgottenpassComponent,
    DocumentComponent,
    SubjectComponent
  ],
  imports: [
    MomentModule,
    BrowserModule,
    AppRoutingModule,
    FlashMessagesModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        }
      }
    })
  ],
  providers: [AuthService ,FlashMessagesService, JwtHelperService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
