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
import { Member, Members } from "src/app/models";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"]
})
export class MembersComponent implements OnInit {
  members$: any;

  constructor(private store$: Store<RootStoreState.State>) {
    this.store$
      .pipe(select(MemberStoreSelectors.selectAllMembers))
      .subscribe(data => {
        this.members$ = data;
      });
  }

  ngOnInit() {
    console.log(this.members$);
  }
}
