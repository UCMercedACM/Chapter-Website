import { createSelector, MemoizedSelector } from "@ngrx/store";
import { MyFeatureStoreSelectors } from "./member";

export const selectError: MemoizedSelector<object, string> = createSelector(
  MyFeatureStoreSelectors.selectMyFeatureError,
  (myFeatureError: string) => {
    return myFeatureError;
  }
);

export const selectIsLoading: MemoizedSelector<
  object,
  boolean
> = createSelector(
  MyFeatureStoreSelectors.selectMyFeatureIsLoading,
  (myFeature: boolean) => {
    return myFeature;
  }
);
