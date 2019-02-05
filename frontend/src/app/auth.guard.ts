import { Injectable } from '@angular/core';
import { CanActivateChild , ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router ){}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    if(this.authService.isLoggedIn()){
      return true;
    }
    else{
      return new Promise((resolve) => {
        this.authService.checkTokenExists().then((tokenExists)=>{
          
          if(tokenExists){
            resolve(true);
          }
          else{
            this.router.navigateByUrl('/login');
            resolve(false);
          }
        })
      })
    }  

  }
}
