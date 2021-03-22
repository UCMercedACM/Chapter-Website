import { Component, OnInit, Input } from "@angular/core";
import { EVENTS } from "../example-events";

@Component({
  selector: "app-event-card",
  templateUrl: "./event-card.component.html",
  styleUrls: ["./event-card.component.scss"]
})
export class EventCardComponent implements OnInit {

  @Input() index!: number;
  events = EVENTS;
  constructor() { }

  ngOnInit(): void {
  }

}
