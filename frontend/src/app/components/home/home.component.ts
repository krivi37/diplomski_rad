import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  Login(): void {
    if(this.username == undefined || this.username == ""){
      this.flashMessage.show("Morate unijeti korisničko ime!", {cssClass: 'alert-danger', timeout: 4000});
    }
    else if ((this.password == undefined || this.password =="")){
      this.flashMessage.show("Morate unijeti lozinku!", {cssClass: 'alert-danger', timeout: 4000});
    }
    else {
      const user = {
        username: this.username,
        password: this.password
      };
      this.authService.authenticateUser(user).subscribe((data: any) => {
          if(!data.success){
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 4000});
          }
          else {
            this.flashMessage.show(data.msg, {cssClass: 'alert-sucess', timeout: 4000});
            this.authService.storeUserData(data.token, data.user);
            if(data.user.type == 'admin') this.router.navigate(['/admin']);
            else if(data.user.type == 'worker')this.router.navigate(['/worker']);
            else if(data.user.type == 'employee') this.router.navigate(['/employee']);
          }
      });
    }
  }

  forgotPassword() : void {
    this.router.navigate(['/forgottenpass']);
  }

  ngOnInit(): void {
    localStorage.clear();
  }

}
