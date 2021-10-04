import { Component, OnInit } from "@angular/core";

import leadership from "../../../assets/data/leadership.json";
import { LeadershipInterface } from "../../../assets/interfaces/leadership.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public leadership: Array<LeadershipInterface> = leadership;

  constructor() {}

  ngOnInit(): void {}
}
