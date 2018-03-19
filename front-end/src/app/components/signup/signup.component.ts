import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpInfo = {
    username:'',
    password:'',
    firstName: '',
    lastName:'',
    address: '',
    city:'',
    state:'',
    zip:'',
    role:'',
    };

  errorMessage: String;

  constructor( private myAuth: AuthService, private myRouter: Router) { }

  ngOnInit() {
  }

  doSignUp() {
    this.myAuth
    .signup(this.signUpInfo)
    .then(resultFromApi => {
      this.signUpInfo = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        city:'',
        state:'',
        zip:'',
        role: '',
      };

      this.errorMessage = '';

      this.myRouter.navigate(['/']);
      // this.myRouter.navigate(['/users/' this.user._id])
    })
    .catch(err => {
      const parsedError = err.json();
      this.errorMessage = parsedError.message;
    });
  }
}

