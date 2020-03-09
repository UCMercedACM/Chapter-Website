import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Member, Members } from "../models";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http
      .get<Members>(environment.MEMBER_MANAGEMENT_API + "/api/members")
      .pipe(map(result => result.members));
  }
}
