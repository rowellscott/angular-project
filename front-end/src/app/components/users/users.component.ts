import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  // Clients for Doctor. For Patient clients = Most Recent Visit
  clients: Array<Object>;
  user: Object;

  //Error Messages
  clientsError: String;
  logoutError: String;

  constructor(
    private myUser: UserService,
    private myRouter: Router,
    private route: ActivatedRoute,
    private myAuth: AuthService,
  ) { }

  ngOnInit() {
    this.myAuth
    .checklogin()
    // If successful, logged in 
    .then(resultFromApi => {
      this.user = resultFromApi;
    })
    // Send Error To console
    .catch(err =>{
      console.log(err);
      this.myRouter.navigate(['/'])
    });
    this.route.params.subscribe(
      (params) => {
        console.log(params['id']);
        this.getClients(params["id"]);
      });
  }

      getClients(id){
        this.myUser.getUser(id)
        .subscribe(clients => {
          console.log('clients: ', clients);
          this.clients = clients;
          console.log('clients: ', this.clients);
        },
        () => {
          this.clientsError = 'No Clients'
        });
      }

      logout(){
        this.myAuth.logout()
        .then(() => {
          this.myRouter.navigate(['/']);
        })
        .catch(()=>{
          this.logoutError = 'Error Logging Out'
        });
      }

}
