import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import {
    faTwitter,
    faLinkedinIn,
    faFacebookF,
    faGithub,
    faDiscord,
    faSlack,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-solid-svg-icons";

import { Member } from "./models";
import {
    RootStoreState,
    MemberStoreActions,
    MemberStoreSelectors,
    MemberStoreState,
} from "src/app/root-store";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    isLoggedIn$: boolean;
    navbarExtend = false;
    professionalOpen = true;
    profileOpen = true;
    faTwitter = faTwitter;
    faLinkedinIn = faLinkedinIn;
    faFacebookF = faFacebookF;
    faGithub = faGithub;
    faDiscord = faDiscord;
    faSlack = faSlack;
    faCopyright = faCopyright;
    faInstagram = faInstagram;
    memberId$: number;

    constructor(private store$: Store<RootStoreState.State>) {
        this.store$
            .pipe(select(MemberStoreSelectors.selectMemberIsLoggedIn))
            .subscribe((data) => {
                this.isLoggedIn$ = data;
            });
    }

    ngOnInit() {}

    onLoggedIn() {
        if (this.isLoggedIn$ === true) {
            this.store$
                .pipe(select(MemberStoreSelectors.selectSelectedMemberId))
                .subscribe((data) => {
                    this.memberId$ = data;
                });

            this.profileOpen = !this.profileOpen;
        }
    }
}
