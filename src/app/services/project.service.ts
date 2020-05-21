import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Project } from "src/app/models";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class ProjectService {
    constructor(private http: HttpClient) {}

    getProjects(): Observable<Project[]> {
        return this.http
            .get<any>(`${environment.PROJECT_MANAGEMENT_API}/api/project`)
            .pipe(map((result) => result.projects));
    }
}
