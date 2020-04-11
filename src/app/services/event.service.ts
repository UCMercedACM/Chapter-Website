import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as JWT from "jwt-decode";

import { Event } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http
      .get<any>(`${environment.MEMBER_MANAGEMENT_API}/api/events`)
      .pipe(
        map(response => {
          if (response.auth === false) {
            throw response.error;
          }

          return JWT(response.token);
        })
      );
  }
}
