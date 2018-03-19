import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  pattern: String;
  // characters = [
  //   'Finn the human',
  //   'Jake the dog',
  //   'Princess bubblegum',
  //   'Lumpy Space Princess',
  //   'Beemo1',
  //   'Beemo2'
  // ];

  characters = [
    {name: 'Finn the human'},
    {name:'Jake the dog'},
    {name:'Princess bubblegum'},
    {name:'Lumpy Space Princess'},
    {name:'Beemo1'},
    {name:'Beemo2'}
  ];

  
}
