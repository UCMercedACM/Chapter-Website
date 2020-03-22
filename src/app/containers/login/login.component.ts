import { Component, OnInit } from "@angular/core";

import { Member } from "../../models";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  member: Member;

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.member);
  }
}
