import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Workshop } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class WorkshopService {
    constructor(private http: HttpClient) {}

    getWorkshops(): Observable<Workshop[]> {
        return this.http
            .get<any>(`${environment.WORKSHOP_MANAGEMENT_API}/api/workshops`)
            .pipe(map((result) => result.workshops));
    }
}
