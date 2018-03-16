import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  profile: Object;

  constructor(
    private myUser: UserService,
    private myAuth: AuthService,
    private myRouter: Router,
    private myRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.myAuth
    .checklogin()
    // If successful, logged in
    .then(resultFromApi => {
      this.user = resultFromApi;
    })
    // Send Error To console
    .catch(err => {
      console.log(err);
      this.myRouter.navigate(['/']);
    });
    this.myRoute.params.subscribe(
      (params) => {
        console.log(params['id']);
        this.getProfileInfo(params['id']);
      });
  }

    getProfileInfo(id) {
      this.myUser.getProfile(id).
      then(res => {
        this.profile = res;
        console.log('Profile: ', this.profile);
      })
      .catch(err => {
        console.log(err);
      });
    }

    update(id, formData){
      this.myUser.updateProfile(id)
    }



}
