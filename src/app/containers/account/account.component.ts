import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { Member } from "../../models";
import { RootStoreState, MemberStoreActions } from "src/app/root-store";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  member: Member;

  constructor(private store: Store<RootStoreState.State>) {}

  ngOnInit() {}
}
