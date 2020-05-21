import { createAction, props } from "@ngrx/store";

import { CTFMeetings } from "src/app/models";

export const loadCTFMeetingsSuccess = createAction(
    "[CTF] Load CTF Meetings Success",
    props<{ data: CTFMeetings[] }>()
);

export const loadCTFMeetingsFailure = createAction(
    "[CTF] Load CTF Meetings Failure",
    props<{ error: any }>()
);
