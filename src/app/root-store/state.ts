import { MemberStoreState } from "./member";
import { CoffeeNCodeStoreState } from "./coffee-n-code";
import { EventStoreState } from "./event";
import { KodingKataStoreState } from "./koding-kata";
import { LANStoreState } from "./lan";
import { ProjectStoreState } from "./project";
import { WorkshopStoreState } from "./workshop";
import { CTFStoreState } from "./capture-the-flag";
import { Auth } from '../models';

export interface State {
    member: MemberStoreState.MemberState;
    auth: Auth;
    coffeeNCode: CoffeeNCodeStoreState.CoffeeNCodeState;
    event: EventStoreState.EventState;
    kodingKata: KodingKataStoreState.KodingKataState;
    lan: LANStoreState.LANState;
    project: ProjectStoreState.ProjectState;
    workshop: WorkshopStoreState.WorkshopState;
    ctf: CTFStoreState.CTFState;
}
