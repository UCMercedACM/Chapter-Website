import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-code-editor",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"]
})
export class EventsComponent implements OnInit {
  i: number = 0;
  imageArray: any[] = [
    { imageUrl: "assets/img/undraw_environmental_study.svg", imageAlt: "" },
    { imageUrl: "assets/img/undraw_nakamoto.svg", imageAlt: "" },
    { imageUrl: "assets/img/undraw_scrum_board.svg", imageAlt: "" },
    { imageUrl: "assets/img/undraw_solution_mindset.svg", imageAlt: "" },
    { imageUrl: "assets/img/undraw_team_page.svg", imageAlt: "" }
  ];

  constructor() {}

  ngOnInit() {}

  getNextEvent() {
    if (this.i === this.imageArray.length - 1) {
      this.i = 0;
    } else {
      this.i += 1;
    }
  }

  getPreviousEvent() {
    if (this.i === 0) {
      this.i = this.imageArray.length - 1;
    } else {
      this.i--;
    }
  }
}
