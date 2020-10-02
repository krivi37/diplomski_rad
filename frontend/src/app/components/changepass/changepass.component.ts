import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {

  forgotten: boolean;
  changingPass: boolean;
  newPassword: string;
  newPassword2: string;
  oldPassword: string;
  finished: boolean;
  userType: string;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this.forgotten = this.authService.questioncheck;
    this.changingPass = this.authService.loggedIn();
    if (this.changingPass) this.userType = this.authService.getUserType();
  }

  checkOldPassword() {
    if (this.changingPass) {
      let user = localStorage.getItem('user');
      let username = JSON.parse(user).username;
      this.authService.checkOldPassword(username, this.oldPassword).subscribe((data: any) => {
        if (!data.success) {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
        }
        else if (data.success) {
          this.resetPassword();
        }
      });
    }
  }

  resetPassword() {
    if (this.forgotten || this.changingPass) {
      if ((this.newPassword != this.newPassword2) || (this.newPassword == undefined || this.newPassword == "")) {
        this.flashMessage.show("Morate popuniti oba polja za novu lozinku i ona se moraju poklapati", { cssClass: 'alert-danger', timeout: 3000 });
        return false;
      }
      else {
        this.authService.changePassword(this.authService.forgottenusername, this.newPassword).subscribe((data: any) => {
          if (!data.success) {
            this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
          }
          else {
            this.flashMessage.show("Lozinka uspjesno promijenjena", { cssClass: 'alert-success', timeout: 3000 });
            this.finished = true;
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.authService.forgottenusername = undefined;
    this.authService.forgottenemail = undefined;
    this.authService.questioncheck = false;
  }

}
