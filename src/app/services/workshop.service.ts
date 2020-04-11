import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as JWT from "jwt-decode";

import { Workshop } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class WorkshopService {
  constructor(private http: HttpClient) {}

  getWorkshops(): Observable<Workshop[]> {
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
}
