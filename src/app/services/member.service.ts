import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { Member } from "src/app/models";
import { environment } from "src/environments/environment";
import { RootStoreState } from "../root-store";
import { AuthStoreActions } from "../root-store/auth";

@Injectable({
  providedIn: "root",
})
export class MemberService {
  constructor(
    private http: HttpClient,
    private store$: Store<RootStoreState.State>
  ) {}

  getToken(): string {
    return localStorage.getItem("token");
  }

  login(email: string, password: string): Observable<Member> {
    return this.http
      .post<any>(`${environment.MEMBER_MANAGEMENT_API}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          this.store$.dispatch(AuthStoreActions.Authentication(response.token));
          return response.member;
        })
      );
  }

  signUp(member: Member): Observable<Member> {
    return this.http.post<Member>(
      `${environment.MEMBER_MANAGEMENT_API}/api/signup`,
      { member }
    );
  }
}
