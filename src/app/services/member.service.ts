import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as JWT from "jwt-decode";

import { Member } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class MemberService {
  constructor(private http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem("token");
  }

  login(email: string, password: string): Observable<Member> {
    return this.http
      .get<any>(`${environment.MEMBER_MANAGEMENT_API}/api/login`, {
        params: new HttpParams()
          .append("email", email)
          .append("password", password)
      })
      .pipe(
        map(response => {
          if (response.auth === false) {
            throw response.error;
          }

          return JWT(response.token);
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
