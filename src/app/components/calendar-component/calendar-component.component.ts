import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-component',
  templateUrl: './calendar-component.component.html',
  styleUrls: ['./calendar-component.component.scss']
})
export class CalendarComponentComponent implements OnInit {

  todayDate:Date = new Date();
  currentMonth:number = this.todayDate.getMonth();
  currentYear:number =this.todayDate.getFullYear();

  months:string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  constructor() {
  }

  ngOnInit() {
    this.showCalendar(this.currentMonth, this.currentYear);
  }
todayString:string = this.months[this.currentMonth] + " " + this.currentYear;
showCalendar(currentMonth, currentYear);

//Displaying Calendar 
showCalendar(month:number, year:number){
  let firstDay = (new Date(year, month).getDay());
  
  let daysInMonth = 32 - new Date(year, month, 32).getDate();
  let tbl = document.getElementById("calendar-content");
  tbl.innerHTML = "";
  
  let count = 1;
  
  for(let i = 0; i < 6; i++){
    var row = document.createElement('tr');
    for(let j = 0; j < 7; j++) {
        if (i == 0 && j < firstDay) {
        var col = document.createElement('td');
        col.classList.add('hover:bg-gray-200', 'border', 'px-2', 'py-8');
        var text = document.createTextNode(count.toString());
        col.appendChild(text);
        row.appendChild(col);
        }
      else if (count > daysInMonth) {
        break;
      }
      else{
      var col = document.createElement('td');
      col.classList.add('hover:bg-gray-200', 'border', 'px-2', 'py-8');
      var text = document.createTextNode(count.toString());
      col.appendChild(text);
      row.appendChild(col);
      count++;
      }
    }
    tbl.appendChild(row);
  }
}
//Button functions
nextButton(event){
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.todayString = this.months[this.currentMonth] + " " + this.currentYear;
    this.showCalendar(this.currentMonth, this.currentYear);
}

previousButton(event){
   this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.todayString = this.months[this.currentMonth] + " " + this.currentYear;
    this.showCalendar(this.currentMonth, this.currentYear);
}
todayButton(event){
  this.currentMonth = this.todayDate.getMonth();
  this.currentYear = this.todayDate.getFullYear();
  this.todayString = this.months[this.currentMonth] + " " + this.currentYear;
  this.showCalendar(this.currentMonth, this.currentYear);
}
}
