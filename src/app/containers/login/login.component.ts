import { Component, OnInit } from "@angular/core";
<<<<<<< HEAD:src/app/components/login/login.component.ts
import { select, Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import {
  RootStoreState,
  RootStoreSelectors,
  MemberStoreSelectors,
  MemberStoreActions
} from "src/app/root-store";
import { Member, Members } from "src/app/models";
=======

import { Member } from "../../models";
>>>>>>> develop:src/app/containers/login/login.component.ts

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
<<<<<<< HEAD:src/app/components/login/login.component.ts
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
=======
  member: Member;

  constructor() {}
>>>>>>> develop:src/app/containers/login/login.component.ts

  ngOnInit() {}

  onSubmit() {
<<<<<<< HEAD:src/app/components/login/login.component.ts
    const payload = {
      email: this.email,
      password: this.password
    };

    this.store$.dispatch(MemberStoreActions.loadAuth(payload));
=======
    console.log(this.member);
>>>>>>> develop:src/app/containers/login/login.component.ts
  }
}
