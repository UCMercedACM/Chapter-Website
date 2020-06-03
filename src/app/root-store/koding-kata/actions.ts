import { createAction, props } from "@ngrx/store";

import { TechnicalInterviewQuestions } from "src/app/models";

export const loadTechnicalInterviewQuestionsSuccess = createAction(
    "[Koding Kata] Load Technical Interview Questions Success",
    props<{ data: TechnicalInterviewQuestions[] }>()
);

export const loadTechnicalInterviewQuestionsFailure = createAction(
    "[Koding Kata] Load Technical Interview Questions Failure",
    props<{ error: any }>()
);
