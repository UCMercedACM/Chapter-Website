import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { Member } from "../../models";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  member: Member;
  signUpForm = new FormGroup({
    id: new FormControl(""),
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl("")
  });

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.signUpForm.value);
  }
}
