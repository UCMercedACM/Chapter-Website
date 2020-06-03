import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Event } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class EventService {
    constructor(private http: HttpClient) {}

    getEvents(): Observable<Event[]> {
        return this.http
            .get<any>(`${environment.EVENT_MANAGEMENT_API}/api/events`)
            .pipe(map((result) => result.events));
    }
}
