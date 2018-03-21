import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { VisitService } from '../../services/visit.service';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit {
  user = <any>Object;
  patientID : String;
  newVisit= {
      temperatureDeg: Number,
      temperatureScale: 'F',
      heightNumOne: Number, 
      heightScaleOne: 'ft', 
      heightNumTwo: Number,
      heightScaleTwo: 'in',
      weightNum: Number,
      weightScale: 'lbs',
      bloodPressure: '',
      chiefComplaint: '',
      assessment: '',
      treatment: '',
  }

  //English or Metric System Form Selector
  system = 'USA';

  newVisitError: String;

  constructor(
    private myAuth: AuthService,
    private myRouter: Router,
    private myVisits: VisitService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.myAuth
    .checklogin()
    // If successful, logged in
    .then(resultFromApi => {
      this.user = resultFromApi;
      console.log('New Visit User:', this.user);
    })
    // Send Error To console
    .catch(err => {
      console.log(err);
      this.myRouter.navigate(['/']);
    });
    
    this.route.params.subscribe(
      (params) => {
        console.log(params['id']);
        this.patientID = params['id'];
        console.log(this.newVisit)
      });
  }

  addNewVisit(){
    this.myVisits.addNewVisit(this.patientID, this.newVisit)
    .then(res => {
        this.newVisit = {
          temperatureDeg: Number,
          temperatureScale: 'F',
          heightNumOne: Number, 
          heightScaleOne: 'ft', 
          heightNumTwo: Number,
          heightScaleTwo: 'in',
          weightNum: Number,
          weightScale: 'lbs',
          bloodPressure: '',
          chiefComplaint: '',
          assessment: '',
          treatment: '',
      };
      this.newVisitError='';
      this.myRouter.navigate(['/users/', this.user._id]);
      // or redirect to Patient Visit History to Confirm?
    })
    .catch(err => {
        console.log("New Visit Error:", err);
        this.newVisitError = "Error Saving Visit"
        window.scrollTo(0, 0);
    });
  }


}
