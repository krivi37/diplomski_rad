import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-secretquestion',
  templateUrl: './secretquestion.component.html',
  styleUrls: ['./secretquestion.component.css']
})
export class SecretquestionComponent implements OnInit {

  question: string;
  answer: string;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this.authService.getUserSecretQuestion({username: this.authService.forgottenusername}).subscribe((data: any) => {
        if(!data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
        else {
          this.question = data.secret_question;
        }
    });
  }

  checkAnswer() {
    if(this.answer == undefined || this.answer == ""){
      this.flashMessage.show("Morate unijeti odgovor", {cssClass :'alert-danger', timeout: 3000});
      return false;
    }
    else {
      this.authService.checkSecretAnswer(this.answer).subscribe((data: any) => {
          if(!data.success){
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          }
          else {
            this.authService.questioncheck = true;
            this.router.navigate(['/changepass']);
          }
      });
    }
  }

}
