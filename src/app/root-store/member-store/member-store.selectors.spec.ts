import * as fromMemberStore from "./member-store.reducer";
import { selectMemberStoreState } from "./member-store.selectors";

describe("MemberStore Selectors", () => {
  it("should select the feature state", () => {
    const result = selectMemberStoreState({
      [fromMemberStore.memberStoreFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
