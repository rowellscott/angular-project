import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment'
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})

export class NewClientComponent implements OnInit {
  newClient = {
    patientFirstName: "",
    patientLastName: "", 
    patientAddress: "",
    patientCity: "",
    patientState: '', 
    patientZip: "",
    patientGender: "",
    patientInsuranceCo: "",
  }

  user = <any>{};
  savingError: String;

  constructor(
    private myUser: UserService,
    private myAuth: AuthService,
    private myRouter: Router
  ) {}

  ngOnInit() {
    this.myAuth
    .checklogin()
    // If successful, logged in
    .then(resultFromApi => {
      this.user = resultFromApi;
      console.log(this.user);
    })
    // Send Error To console
    .catch(err => {
      console.log(err);
      this.myRouter.navigate(['/']);
    });
  }

    saveNewClient() {
      this.myUser.createClient(this.newClient)
      .then(res => {
        this.newClient = {
          patientFirstName: '',
          patientLastName: '',
          patientAddress: '',
          patientCity: '',
          patientState: '',
          patientZip: '',
          patientGender: '',
          patientInsuranceCo: '',
        };
        this.savingError = '';
        this.myRouter.navigate(['/users', this.user._id])
      })
      .catch( err => {
        this.savingError = 'Error Adding Client'
      });
    }

}


