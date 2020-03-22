import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { Member } from "../../models";
import { RootStoreState, MemberStoreActions, MemberStoreSelectors } from "src/app/root-store";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  member: Member;
  active = 'Bob';

  constructor(private store: Store<RootStoreState.State>) {
    console.log(MemberStoreSelectors.selectMemberById(100222333))
    this.store.select(MemberStoreSelectors.selectMemberById(100222333)).subscribe({
      next(x) { this.member = x;
        console.log(x)
      },
      error(err) { console.error('something wrong occurred: ' + err);},
      complete() { console.log('done'); }
    });
  }

  ngOnInit() {}

  onSubmit() {
    const payload = {
      email: this.member.email,
      password: this.member.password
    };

    this.store.dispatch(MemberStoreActions.loadAuth(payload));
  }
}
