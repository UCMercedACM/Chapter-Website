import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";

import { Member } from "../../models";
import {
  RootStoreState,
  RootStoreSelectors,
  MemberStoreSelectors,
  MemberStoreActions
} from "src/app/root-store";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  members$: any;
  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  });

  constructor(private store$: Store<RootStoreState.State>) {
    this.store$
      .pipe(select(MemberStoreSelectors.selectAllMembers))
      .subscribe(data => {
        this.members$ = data;
      });
  }

  ngOnInit() {}

  onSubmit() {
    const payload = this.loginForm.value;

    this.store$.dispatch(MemberStoreActions.loadAuth(payload));
    console.log(this.store$);
  }
}
