import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import {
  RootStoreState,
  RootStoreSelectors,
  MemberStoreSelectors,
  MemberStoreActions
} from "src/app/root-store";
import { Member } from "../../models";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  members$: any;
  email?: string;
  password?: string;

  constructor(private store$: Store<RootStoreState.State>) {
    this.store$
      .pipe(select(MemberStoreSelectors.selectAllMembers))
      .subscribe(data => {
        this.members$ = data;
      });
  }

  ngOnInit() {}

  onSubmit() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.store$.dispatch(MemberStoreActions.loadAuth(payload));
    console.log(this.store$);
  }
}
