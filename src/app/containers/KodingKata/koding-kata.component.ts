import { Component, OnInit } from "@angular/core";


@Component({
  selector: "app-koding-kata",
  templateUrl: "./koding-kata.component.html",
  styleUrls: ["./koding-kata.component.scss"]
})
export class KodingKataComponent implements OnInit {
  
  headers = ["Rank", "Name", "Points"];
  rows = [
    {
      "Rank": "1st",
      "Name": "Paulo S.",
      "Points": "500"
    },
    {
      "Rank": "2nd",
      "Name": "Sean C.",
      "Points": "450"
    },
    {
      "Rank": "3rd",
      "Name": "Busher B.",
      "Points": "300"
    }
  ]
  
  leaderboard: any[] = [
    {
      rank: "1st",
      name: "Paulo S.",
      points: "500"
     
    },
    {
     
      rank: "2nd",
      name: "Sean C.",
      points: "450"
    },
    {
      rank: "3rd", 
      name: "Busher B",
      points: "440"
    },
  ];

  
  
  constructor() {}

  

  ngOnInit() {}
}

