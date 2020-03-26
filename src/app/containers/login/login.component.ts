import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { Member } from "../../models";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  member: Member;
  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  });

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.loginForm.value);
  }
}
