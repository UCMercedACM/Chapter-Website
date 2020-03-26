import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Member, Members } from "../models";
import * as JWT from 'jwt-decode';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private BASE_URL = 'http://localhost:4201'

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http
      .get<Members>(environment.MEMBER_MANAGEMENT_API + "/api/members")
      .pipe(map(result => result.members));
  }
  getToken(): string{
    return localStorage.getItem('token');
  }

  login(email: string, password: string): Observable<Member> {
    const url = `${this.BASE_URL}/api/login`; //Change to backend endpoint for auth and token generation
    let res;
    let member: Member;
    return this.http
      .get<any>(`${environment.MEMBER_MANAGEMENT_API}/api/login`, {
        params: new HttpParams()
          .append("email", email)
          .append("password", password)
      })
      .pipe(
        map(result => {
          console.log(result);
          if (result.auth === false){
            throw result.error;
          }
          var successData = JWT(result.token).data;
          member = {
            id: successData.student_id,
            firstName: successData.first_name,
            lastName: successData.last_name,
            email: successData.email,
            token: result.token,
            year: successData.year,
            github: successData.github,
            linkedin: successData.linkedin,
            portfolium: successData.portfolium,
            handshake: successData.handshake,
            slack: successData.slack,
            discord: successData.discord,
            active: successData.active,
            banned: successData.banned,
            privilege: successData.privilege,
            createdDate: successData.created_at
          }
          return {
            yourData: member,
            ...result
          };
        })
      );
    // return axios.post(url, {"email": email, "password": password})
    //   .then((response) => {
    //     console.log(response.data);
    //     if (response.data.auth == false){
    //       throw response.data.error;
    //     }
    //     var successData = JWT(response.data.token).data;
    //     console.log(successData);

    //     console.log(successData.student_id);
    //     console.log(member);

    //     member = {
    //       id: successData.student_id,
    //       firstName: successData.first_name,
    //       lastName: successData.last_name,
    //       email: successData.email,
    //       token: response.data.token,
    //       year: successData.year,
    //       github: successData.github,
    //       linkedin: successData.linkedin,
    //       portfolium: successData.portfolium,
    //       handshake: successData.handshake,
    //       slack: successData.slack,
    //       discord: successData.discord,
    //       active: successData.active,
    //       banned: successData.banned,
    //       privilege: successData.privilege,
    //       createdDate: successData.created_at
    //     }
    //     return of(member);
    //   });
    // return all member for user
    // need to write query in backend to check email
  }

  signUp(member: Member): Observable<Member> {
    const url = `${this.BASE_URL}/api/signup`;
    return this.http.post<Member>(url, {member});
  }
  
  
}
