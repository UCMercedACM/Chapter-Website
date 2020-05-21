import { createAction, props } from "@ngrx/store";

import { LAN } from "src/app/models";

export const loadLANPartySuccess = createAction(
    "[LAN] Load LAN Party Success",
    props<{ data: LAN[] }>()
);

export const loadLANPartyFailure = createAction(
    "[LAN] Load LAN Party Failure",
    props<{ error: any }>()
);
