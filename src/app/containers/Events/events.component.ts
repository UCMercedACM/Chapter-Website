import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-code-editor",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"]
})
export class EventsComponent implements OnInit {
  i = 0;
  images: any[] = [
    {
      url: "assets/img/undraw_coffee_break.svg",
      alt: "Coffee n Code",
      title: "Coffee and Code",
      description:
        "In need of help with a course or a project? We have just the resource for you! Stop by and get help with anything.",
      date: "Every Tuesday and Thursday",
      time: "12 to 4 PM"
    },
    {
      url: "assets/img/undraw_conversation.svg",
      alt: "General Meeting",
      title: "General Meeting",
      description:
        "All the upcoming events, news, and secret projects we have been working on in one place!",
      date: "April 2nd",
      time: "6 PM"
    },
    {
      url: "assets/img/undraw_conference_call.svg",
      alt: "Alumni Panel",
      title: "Alumni Panel",
      description:
        "Come ask questions to alumni who have made their stakes in enterprise companies and have gained professional industry experience",
      date: "April 2nd",
      time: "7 PM"
    },
    {
      url: "assets/img/undraw_interview.svg",
      alt: "Koding Kata",
      title: "Koding Kata",
      description:
        "Technical Interview prep at your finger tips, join us weekly for at least 3 different questions that could be on your next interview!",
      date: "Every Wednesday",
      time: "3 to 5 PM"
    },
    {
      url: "assets/img/undraw_calculator.svg",
      alt: "Web Dev Workshop",
      title: "Web Dev Workshop",
      description:
        "Introductory level web development class where you will learn how to program a simple calculator using HTML/CSS and JavaScript",
      date: "April 9th",
      time: "6 PM to 8PM"
    }
  ];

  constructor() {}

  ngOnInit() {}

  openNewsletter() {
    window.open("src/assets/Newsletter.pdf");
  }

  getNextEvent() {
    if (this.i === this.images.length - 1) {
      this.i = 0;
    } else {
      this.i += 1;
    }
  }

  getPreviousEvent() {
    if (this.i === 0) {
      this.i = this.images.length - 1;
    } else {
      this.i--;
    }
  }
}
