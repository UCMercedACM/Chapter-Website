import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CTFMeetings } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class CTFService {
    constructor(private http: HttpClient) {}

    getCTFMeetings(): Observable<CTFMeetings[]> {
        return this.http
            .get<any>(`${environment.CAPTURE_THE_FLAG_MANAGEMENT_API}/api/meetings`)
            .pipe(map((result) => result.meetings));
    }
}
