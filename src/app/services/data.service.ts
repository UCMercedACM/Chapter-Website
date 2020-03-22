import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Member, Members } from "../models";
import axios from 'axios';
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
    const url = `${this.BASE_URL}/api/logi`; //Change to backend endpoint for auth and token generation
    let res;
    let member: Member;
    axios.post(url, {"email": email, "password": password})
      .then((response) => {
        console.log(response.data);
        if (response.data.auth == false){
          throw response.data.error;
        }
        member = JWT(response.data.token).payload.data.map(attr=>{
          return <Member>{
            id: attr.student_id,
            firstName: attr.first_name,
            lastName: attr.last_name,
            email: attr.email,
            token: response.data.token,
            year: attr.year,
            github: attr.github,
            linkedin: attr.linkedin,
            portfolium: attr.portfolium,
            handshake: attr.handshake,
            slack: attr.slack,
            discord: attr.discord,
            active: attr.active,
            banned: attr.banned,
            privilege: attr.privilege,
            createdDate: attr.created_at
          }
        });

      });
    console.log({data: member});
    return of(member);
    // return all member for user
    // need to write query in backend to check email
  }

  signUp(member: Member): Observable<Member> {
    const url = `${this.BASE_URL}/api/signup`;
    return this.http.post<Member>(url, {member});
  }
  
  
}
