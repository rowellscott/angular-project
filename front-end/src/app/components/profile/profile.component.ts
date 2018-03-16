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

  updatedUsername: String;
  updatedFirstName: String;
  updatedLastName: String;
  updatedGender: String;
  updatedAddress: String;
  updatedCity: String;
  updatedState: String;
  updatedZip: Number;
  updatedInsuranceCo: String;

  updatedUser = {};

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
      console.log(this.user)
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

    updateProfile(id, formData) {
      //
      //Get Data From Form
      const formInfo = formData.form.controls;
      this.updatedUsername = formInfo.updatedUsername.value;
      this.updatedFirstName = formInfo.updatedFirstName.value;
      this.updatedLastName = formInfo.updatedLastName.value;
      this.updatedGender = this.profile.gender;
      this.updatedAddress = formInfo.updatedAddress.value;
      this.updatedCity = formInfo.updatedCity.value;
      this.updatedState = formInfo.updatedState.value;
      this.updatedZip = formInfo.updatedZip.value;
      if (this.profile.role==="Patient"){
            this.updatedInsuranceCo = formInfo.updatedInsuranceCo.value;
        }
      //Send Updates To Api
      this.sendUpdatesToApi(id);
    }

    sendUpdatesToApi(id) {
      this.updatedUser = {
        updatedUsername: this.updatedUsername,
        updatedFirstName: this.updatedFirstName,
        updatedLastName: this.updatedLastName,
        updatedGender: this.profile.gender,
        updatedAddress: this.updatedAddress,
        updatedCity: this.updatedCity,
        updatedState: this.updatedState,
        updatedZip: this.updatedZip,
        updatedInsuranceCo: this.updatedInsuranceCo
      };
      this.myUser.updateUser(id, this.updatedUser)
      .toPromise()
      .then( res => {
        this.myRouter.navigate(['/users/ ' + id]);
      })
      .catch( err => {
        console.log('Error Updating User', err);
      });
    }

    deleteThisUser(){
      if (!confirm("Are you sure?")) {
        return;
      }
      this.myUser.deleteUser(this.user._id)
        .then( res => {
          this.myRouter.navigate(['/'])
        })
        .catch( err => {
          console.log("Error in deleting:", err)
        });
    }
    }



}
