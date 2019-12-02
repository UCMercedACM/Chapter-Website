import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Member } from "../../models";

export const featureAdapter: EntityAdapter<Member> = createEntityAdapter<
  Member
>({
  selectId: model => model.id,
  sortComparer: (a: Member, b: Member): number =>
    b.email.toString().localeCompare(a.email.toString())
});

export interface State extends EntityState<Member> {
  isLoading?: boolean;
  error?: any;
}

export const initialState: State = featureAdapter.getInitialState({
  isLoading: false,
  error: null
});
