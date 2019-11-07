import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  message = 'World!';

  constructor() { }

  ngOnInit() {
    axios.get('http://localhost:4100/api/feedback').then(data => {
      this.message = data.data.message;
      console.log(this.message);
    });
  }

}
