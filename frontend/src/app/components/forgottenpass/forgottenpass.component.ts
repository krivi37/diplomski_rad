import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgottenpass',
  templateUrl: './forgottenpass.component.html',
  styleUrls: ['./forgottenpass.component.css']
})
export class ForgottenpassComponent implements OnInit {

  username: string;
  email: string;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
  }

  forgottenPass() {
      if(this.username == undefined || this.username == "" || this.email == undefined || this.email == "") {
        this.flashMessage.show('Niste popunili sva polja!', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
      else {
        this.authService.checkForgottenUser({username: this.username, email: this.email}).subscribe((data : any)=>{
            if(!data.success) {
              this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
            }
            else {
              this.authService.forgottenusername = this.username;
              this.authService.forgottenemail = this.email;
              this.router.navigate(['/secretquestion']);
            }
        });
      }
  }

}
