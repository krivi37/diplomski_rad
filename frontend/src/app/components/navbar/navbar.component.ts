import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( 
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
  }

  onLogoutClick(){
    this.authService.logout();
    this.flashMessage.show('Uspješno ste se izlogovali', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['/']);
    return false;
}

}
