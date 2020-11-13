import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { FormControl, FormGroup } from "@angular/forms";

import { Member } from "../../models";
import { RootStoreState, MemberStoreActions } from "src/app/root-store";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    member$: Member;
    loginForm = new FormGroup({
        email: new FormControl(""),
        password: new FormControl(""),
    });

    constructor(private store$: Store<RootStoreState.State>) {}

    ngOnInit() {}

    onSubmit() {
        const { email, password } = this.loginForm.value;

        this.store$.dispatch(
            MemberStoreActions.loginAuthentication({
                email,
                password,
            })
        );
    }
}
