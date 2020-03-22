import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  faTwitter,
  faLinkedinIn,
  faFacebookF,
  faGithub,
  faDiscord,
  faSlack,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-solid-svg-icons";

import { MemberStoreActions } from "./root-store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  navbarExtend: boolean = false;
  professionalOpen: boolean = true;
  profileOpen: boolean = true;
  faTwitter = faTwitter;
  faLinkedinIn = faLinkedinIn;
  faFacebookF = faFacebookF;
  faGithub = faGithub;
  faDiscord = faDiscord;
  faSlack = faSlack;
  faCopyright = faCopyright;
  faInstagram = faInstagram;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(MemberStoreActions.loadMembers());
  }
}
