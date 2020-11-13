import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { FormControl, FormGroup } from "@angular/forms";

import { Member } from "../../models";
import { RootStoreState, MemberStoreActions } from "src/app/root-store";

@Component({
    selector: "app-sign-up",
    templateUrl: "./sign-up.component.html",
    styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
    member: Member;
    signUpForm = new FormGroup({
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        email: new FormControl(""),
        password: new FormControl(""),
    });

    constructor(private store$: Store<RootStoreState.State>) {}

    ngOnInit() {}

    onSubmit() {
        const { firstName, lastName, email, password } = this.signUpForm.value;

        this.store$.dispatch(
            MemberStoreActions.signUpAuthentication({
                firstName,
                lastName,
                email,
                password,
            })
        );
    }
}
