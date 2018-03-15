import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private myAuth: AuthService, private myRouter: Router) { }
  loginInfo={
    username:'',
    password:'',
  }

  loginErrorMessage: String;

  ngOnInit() {
  
  }

  doLogin() {
    this.myAuth.login(this.loginInfo)
    .then((resultFromApi)=>{
      this.loginInfo = {
        username: '',
        password: ''
      };

    this.loginErrorMessage = '';

    // this.myRouter.navigate(['/users/:id'])
    this.myRouter.navigate(['/']);
    })
    .catch(err => {
      const parsedError = err.json();
      this.loginErrorMessage = parsedError.message;
    });
  }
}
