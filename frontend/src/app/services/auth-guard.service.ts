import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private authservice: AuthService,
    private flashMessage: FlashMessagesService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const userType = this.authservice.getUserType();
    if (this.authservice.loggedIn() && this.authservice.isAuthorized(route.data.allowedRoles)) {
        return true;
    }

    this.flashMessage.show("Nedozvoljen pristup, vraceni ste na odgovarajucu stranicu za Vas nalog", { cssClass: 'alert-danger', timeout: 4000 });
    if(userType == 'admin') this.router.navigate(['/admin'], { queryParams: { returnUrl: state.url } });
    else if (userType == 'employee') this.router.navigate(['/employee'], { queryParams: { returnUrl: state.url } });
    else if (userType == 'worker') this.router.navigate(['/worker'], { queryParams: { returnUrl: state.url } });
    return false;
    
  }  
}
