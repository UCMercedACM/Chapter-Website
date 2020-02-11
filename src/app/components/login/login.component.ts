import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { Member } from "../../models";
import { RootStoreState, MemberStoreActions } from "src/app/root-store";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  member: Member;
  active: true;

  constructor(private store: Store<RootStoreState.State>) {}

  ngOnInit() {}

  onSubmit() {
    const payload = {
      email: this.member.email,
      password: this.member.password
    };

    this.store.dispatch(MemberStoreActions.loadAuth(payload));
  }
}
