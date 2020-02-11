import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Member, Members } from "../models";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private BASE_URL = 'http://localhost:3000'

  constructor(private http: HttpClient) {}

  getItems(): Observable<Member[]> {
    return this.http
    .get<Members>(`https://anlisp.herokuapp.com/api/members`)
    .pipe(map(result => result.members));
  }
  getToken(): string{
    return localStorage.getItem('token');
  }

  login(email: string, password:string): Observable<any> {
    const url = `${this.BASE_URL}/token`; //Change to backend endpoint for auth and token generation
    return this.http.post<Member>(url, {email, password}); // return all member for user
    // need to write query in backend to check email
  }

  signUp(email: string, password:string): Observable<Member> {
    const url = `${this.BASE_URL}/register`;
    return this.http.post<Member>(url, {email, password});
  }
  
  
}
