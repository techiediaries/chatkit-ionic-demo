import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_SERVER: string = 'http://localhost:3000';

  

  authState = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  register(userInfo: User): Observable<User> {
    return this.httpClient.post<User>(`${this.AUTH_SERVER}/register`, userInfo);
  }

  login(userInfo: User): Observable<any> {
    return this.httpClient.post(`${this.AUTH_SERVER}/login`, userInfo).pipe(
      tap(async (res: { status: number, access_token, expires_in, user_id }) => {
        if (res.status !== 404) {
          await this.storage.set("ACCESS_TOKEN", res.access_token);
          await this.storage.set("EXPIRES_IN", res.expires_in);
          await this.storage.set("USER_ID", res.user_id);
          this.authState.next(true);
        }
      })
    );
  }

  async logout(){
    await this.storage.remove("ACCESS_TOKEN");
    await this.storage.remove("EXPIRES_IN");
    await this.storage.remove("USER_ID");
    
    this.authState.next(false); 
  }

  checkTokenExists(): Promise<boolean>{
    console.log("Checking token..");

    return new Promise((resolve)=>{
      this.storage.get("ACCESS_TOKEN").then(token => {
        if(token !== null){
          console.log("Token exists, ", token);
          this.authState.next(true);
          resolve(true);
        }
        else
        {
          console.log("No Token exists, ", token);
          this.authState.next(false);
          resolve(false);
        }
      })
    })
  }

  isLoggedIn() {
    
    return this.authState.value;
  }

}
