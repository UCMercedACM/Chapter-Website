import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";

import { MemberStoreEffects } from "./member-store.effects";

describe("MemberStoreEffects", () => {
  let actions$: Observable<any>;
  let effects: MemberStoreEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberStoreEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.get<MemberStoreEffects>(MemberStoreEffects);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});
