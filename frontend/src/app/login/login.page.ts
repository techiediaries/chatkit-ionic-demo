import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
//import { Storage } from '@ionic/storage';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showError: boolean = false;
  constructor(private authService: AuthService, private router: Router/*, private storage: Storage*/) { }

  ngOnInit() {
  }

  login(form) {
    console.log('sending login request');
    this.authService.login(form.value).subscribe( async (res) => {
      console.log(res);
      if (res.status == 200) {
        this.router.navigateByUrl(`home/${res.user_id}`);
        console.log(`home/${res.user_id}`);
        this.showError = false;
        //await this.storage.set("USER_ID", res.user_id);
        
      }
      else {
        this.showError = true;
      }
    });
  }
}
