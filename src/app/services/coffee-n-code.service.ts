import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Resources } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class CoffeeNCodeService {
    constructor(private http: HttpClient) {}

    getResources(): Observable<Resources[]> {
        return this.http
            .get<any>(
                `${environment.COFFEE_N_CODE_MANAGEMENT_API}/api/resources`
            )
            .pipe(map((result) => result.resources));
    }
}
