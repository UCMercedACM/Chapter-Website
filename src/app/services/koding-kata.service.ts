import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { TechnicalInterviewQuestions } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class KodingKataService {
    constructor(private http: HttpClient) {}

    getTechnicalInterviewQuestions(): Observable<
        TechnicalInterviewQuestions[]
    > {
        return this.http
            .get<any>(
                `${environment.KODING_KATA_MANAGEMENT_API}/api/technical-interview-questions`
            )
            .pipe(map((result) => result.questions));
    }
}
