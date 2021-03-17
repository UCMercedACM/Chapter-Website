import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public route = "";
  public title = "Chapter Website";

  constructor(location: Location, private router: Router) {
    router.events.subscribe(() => {
      this.route = location.path();
    });
  }

  ngOnInit() {}
}
