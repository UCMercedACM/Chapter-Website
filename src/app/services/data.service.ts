import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Member, Members } from "../models";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<Member[]> {
    return this.http
    .get<Members>(`https://anlisp.herokuapp.com/api/members`)
    .pipe(map(result => result.members));
  }
}
