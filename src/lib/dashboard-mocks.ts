import { type EventType, type FullEvent } from "@/lib/dashboard-events";
import { type AttendanceMember } from "@/routes/dashboard/events";
import {
  type FullProject,
  JOIN_POLICY_META,
  type JoinPolicy,
  type MediaKind,
  type MediaRecord,
  type MemberProject,
  MOCK_CURRENT_USER,
  type ProjectInvite,
  type ProjectMember,
  type ProjectType,
  SIG_META,
} from "@/routes/dashboard/projects";
import { type ClientMember } from "@/routes/dashboard/route";

/// Types and Interfaces
// Only the seed-data metadata shapes live here; the project/event domain types now
// live in their routes (@/routes/dashboard/projects and .../events) and the seeded
// constants below import them back to stay in sync with the Kanae backend shapes.

/// Constants — seeded mock data

function member(id: string, name: string): ProjectMember {
  return { id, name };
}

// GET /projects → every chapter project (archived included, for the status filter).
// The hand-authored projects below anchor the member Projects page (memberships,
// invites, and gallery media are keyed to their ids); SEEDED_PROJECTS pads the pool
// to ~100 so the Manage Projects table has enough rows to paginate.
const BASE_PROJECTS: FullProject[] = [
  {
    id: "p1",
    name: "BobcatBot",
    type: "sig_swe",
    active: true,
    founded_at: "2024-09-01T00:00:00Z",
    join_policy: "open",
    description:
      "Discord bot for the ACM server — event notifications, QR check-in, and member role management.",
    link: "https://github.com/UCMercedACM/bobcatbot",
    tags: ["Python", "Discord.py", "Postgres"],
    members: [
      member("m-jm", "Javier Morales"),
      member("m-ps", "Priya Shah"),
      member("m-dw", "Dana West"),
    ],
  },
  {
    id: "p2",
    name: "Campus AI Tutor",
    type: "sig_ai",
    active: true,
    founded_at: "2024-10-15T00:00:00Z",
    join_policy: "request",
    description:
      "An LLM-powered study assistant trained on UCM syllabi — answers questions and generates practice problems.",
    link: "https://github.com/UCMercedACM/ai-tutor",
    tags: ["Python", "Machine Learning", "React"],
    members: [
      member("m-lk", "Lena Kovac"),
      member("m-ot", "Omar Tariq"),
      member("m-fr", "Fatima Rahman"),
    ],
  },
  {
    id: "p3",
    name: "CTF Training Platform",
    type: "sig_cyber",
    active: true,
    founded_at: "2024-08-20T00:00:00Z",
    join_policy: "open",
    description:
      "Self-hosted platform with a curated library of CTF challenges across crypto, web, pwn and reversing.",
    link: "https://github.com/UCMercedACM/ctf-platform",
    tags: ["FastAPI", "Docker"],
    members: [member("m-ap", "Alex Park"), member("m-jw", "Jin Wu")],
  },
  {
    id: "p4",
    name: "UCM Enrollment Insights",
    type: "sig_data",
    active: true,
    founded_at: "2024-11-01T00:00:00Z",
    join_policy: "request",
    description:
      "Interactive dashboards visualizing enrollment trends and grade distributions across departments.",
    link: "https://github.com/UCMercedACM/enrollment-insights",
    tags: ["Python", "Postgres"],
    members: [
      member("m-sd", "Sofia Diaz"),
      member("m-rn", "Raj Nair"),
      member("m-ml", "Maya Lopez"),
    ],
  },
  {
    id: "p5",
    name: "Ray Tracer Engine",
    type: "sig_graph",
    active: false,
    founded_at: "2024-09-10T00:00:00Z",
    join_policy: "closed",
    description:
      "A physically-based ray tracer in C++ supporting global illumination, reflections and soft shadows.",
    link: "https://github.com/UCMercedACM/ray-tracer",
    tags: ["C++"],
    members: [member("m-ch", "Chen Hu")],
  },
  {
    id: "p6",
    name: "Kanae API",
    type: "independent",
    active: true,
    founded_at: "2023-06-01T00:00:00Z",
    join_policy: "closed",
    description:
      "The backend REST API powering the member portal — auth, check-in, project management, and member data.",
    link: "https://github.com/UCMercedACM/kanae",
    tags: ["FastAPI", "Postgres", "Python"],
    members: [
      member("m-jm", "Javier Morales"),
      member("m-n7", "No767"),
      member("m-ps", "Priya Shah"),
    ],
  },
  {
    id: "p7",
    name: "ML Study Group Notebooks",
    type: "sig_ai",
    active: false,
    founded_at: "2024-02-14T00:00:00Z",
    join_policy: "open",
    description:
      "A curated collection of Jupyter notebooks covering supervised learning, CNNs and transformers.",
    link: "https://github.com/UCMercedACM/ml-notebooks",
    tags: ["Machine Learning", "Python"],
    members: [member("m-lk", "Lena Kovac"), member("m-ps", "Priya Shah")],
  },
];

// Deterministic filler so the Manage Projects table has enough rows to paginate.
// Everything is derived from the row index, so the seed is stable across reloads
// (no Math.random) — a real deployment would page GET /projects for these instead.
const SEED_TYPES = Object.keys(SIG_META) as ProjectType[];
const SEED_POLICIES = Object.keys(JOIN_POLICY_META) as JoinPolicy[];
const SEED_PREFIXES = [
  "Bobcat",
  "Campus",
  "Merced",
  "Chapter",
  "Sierra",
  "Valley",
  "Atlas",
  "Nova",
  "Orbit",
  "Pixel",
  "Quantum",
  "Vector",
  "Cascade",
  "Summit",
  "Delta",
  "Ember",
];
const SEED_SUFFIXES = [
  "Scheduler",
  "Tracker",
  "Dashboard",
  "Engine",
  "Toolkit",
  "Portal",
  "Analyzer",
  "Simulator",
  "Planner",
  "Visualizer",
  "Pipeline",
  "Compiler",
  "Optimizer",
  "Explorer",
  "Monitor",
  "Assistant",
  "Notebook",
  "Sandbox",
  "Playground",
  "Studio",
];
const SEED_TAGS = [
  "Python",
  "React",
  "Postgres",
  "FastAPI",
  "Docker",
  "TypeScript",
  "Rust",
  "Go",
  "Machine Learning",
  "WebGL",
  "Kubernetes",
  "Redis",
  "GraphQL",
  "Swift",
];
const SEED_NAMES = [
  "Avery Stone",
  "Bao Nguyen",
  "Cara Fields",
  "Diego Ruiz",
  "Elena Vasquez",
  "Finn O'Brien",
  "Grace Park",
  "Hassan Ali",
  "Ivy Chen",
  "Jonah Reed",
  "Kira Novak",
  "Liam Torres",
  "Mira Shah",
  "Nash Carter",
  "Owen Blake",
  "Piper Quinn",
  "Rhea Kapoor",
  "Sam Whitfield",
  "Tara Bloom",
  "Umar Faruk",
];

function seedProjects(count: number): FullProject[] {
  return Array.from({ length: count }, (_, i): FullProject => {
    const type = SEED_TYPES[i % SEED_TYPES.length];
    const name = `${SEED_PREFIXES[i % SEED_PREFIXES.length]} ${SEED_SUFFIXES[(i * 3) % SEED_SUFFIXES.length]}`;
    const memberCount = 1 + (i % 6);
    const members = Array.from({ length: memberCount }, (_, j) => {
      const pick = (i * 7 + j * 5) % SEED_NAMES.length;
      return member(`sm-${String(i)}-${String(j)}`, SEED_NAMES[pick]);
    });
    const tagCount = 1 + (i % 3);
    const tags = Array.from(
      { length: tagCount },
      (_, j) => SEED_TAGS[(i * 2 + j * 5) % SEED_TAGS.length],
    );
    const year = 2022 + (i % 4);
    const month = String((i % 12) + 1).padStart(2, "0");
    return {
      id: `sp-${String(i + 1)}`,
      name,
      type,
      // ~1 in 6 archived so the status filter has both buckets to page through.
      active: i % 6 !== 5,
      founded_at: `${String(year)}-${month}-01T00:00:00Z`,
      join_policy: SEED_POLICIES[i % SEED_POLICIES.length],
      description: `${SIG_META[type].label} project — ${name.toLowerCase()} for the UC Merced ACM chapter, built and maintained by the ${SIG_META[type].label} SIG.`,
      link: `https://github.com/UCMercedACM/${name.toLowerCase().replaceAll(/\s+/g, "-")}`,
      tags,
      members,
    };
  });
}

export const MOCK_PROJECTS: FullProject[] = [...BASE_PROJECTS, ...seedProjects(100)];

// The current member is on p1, p2, and p6.
const MINE_IDS = new Set(["p1", "p2", "p6"]);

// GET /members/me/projects → the current member's projects (lite shape).
export const MOCK_MEMBER_PROJECTS: MemberProject[] = MOCK_PROJECTS.filter((project) =>
  MINE_IDS.has(project.id),
).map(({ members: _members, ...rest }) => rest);

// GET /members/me/projects/invites?status=pending → the current member's pending
// invitations (kind=invite) and their own outstanding requests (kind=request).
export const MOCK_PROJECT_INVITES: ProjectInvite[] = [
  {
    id: "iv1",
    project_id: "p3",
    kind: "invite",
    status: "pending",
    invited_by: "m-ap",
    member: MOCK_CURRENT_USER,
    message: "We could use your backend help on the scoreboard service — join us?",
    created_at: "2026-06-14T18:00:00Z",
  },
  {
    id: "iv2",
    project_id: "p7",
    kind: "invite",
    status: "pending",
    invited_by: "m-lk",
    member: MOCK_CURRENT_USER,
    created_at: "2026-06-09T15:30:00Z",
  },
  {
    id: "rq-me-1",
    project_id: "p4",
    kind: "request",
    status: "pending",
    member: MOCK_CURRENT_USER,
    message: "Would love to help build the grade-distribution views.",
    created_at: "2026-06-15T09:45:00Z",
  },
];

// Manager-scoped invites: incoming join requests to review (kind=request) and the
// manager's outstanding outgoing invites (kind=invite). A live deployment aggregates
// GET /projects/{id}/invites across every project the manager can edit.
export const MOCK_MANAGE_INVITES: ProjectInvite[] = [
  {
    id: "rq-mng-1",
    project_id: "p2",
    kind: "request",
    status: "pending",
    member: member("m-ml", "Maya Lopez"),
    message: "Took the intro ML workshop — would love to contribute to the tutor.",
    created_at: "2026-06-13T20:10:00Z",
  },
  {
    id: "rq-mng-2",
    project_id: "p2",
    kind: "request",
    status: "pending",
    member: member("m-ot", "Omar Tariq"),
    message: "Happy to help with the React front-end.",
    created_at: "2026-06-15T09:45:00Z",
  },
  {
    id: "rq-mng-3",
    project_id: "p4",
    kind: "request",
    status: "pending",
    member: member("m-ch", "Chen Hu"),
    created_at: "2026-06-12T11:00:00Z",
  },
  {
    id: "rq-mng-4",
    project_id: "p1",
    kind: "request",
    status: "pending",
    member: member("m-fr", "Fatima Rahman"),
    message: "I can take on the QR check-in flow.",
    created_at: "2026-06-16T08:20:00Z",
  },
  {
    id: "iv-mng-1",
    project_id: "p2",
    kind: "invite",
    status: "pending",
    invited_by: MOCK_CURRENT_USER.id,
    member: member("m-nw", "Noah Williams"),
    message: "Want to own the eval harness?",
    created_at: "2026-06-11T14:00:00Z",
  },
];

// GET /projects/{id}/media → content-addressed gallery records, keyed by project id.
function buildMedia(seed: number, count: number): MediaRecord[] {
  return Array.from({ length: count }, (_, index) => {
    const kind: MediaKind = index % 4 === 3 ? "video" : "image";
    const hash = (seed * 1000 + index + 1).toString(16).padStart(64, "0");
    return {
      hash,
      kind,
      content_type: kind === "video" ? "video/mp4" : "image/webp",
      size: kind === "video" ? 40_000_000 + index * 5_000_000 : 900_000 + index * 220_000,
      created_at: `2025-0${String((index % 8) + 1)}-12T00:00:00Z`,
      url: `https://cdn.acm.ucmerced.edu/media/${hash.slice(0, 12)}`,
    };
  });
}

export const MOCK_PROJECT_MEDIA: Record<string, MediaRecord[]> = {
  p1: buildMedia(1, 4),
  p2: buildMedia(2, 3),
  p3: buildMedia(3, 2),
  p4: buildMedia(4, 7),
  p5: buildMedia(5, 2),
  p6: buildMedia(6, 4),
  p7: buildMedia(7, 1),
};

/// Constants — seeded dashboard events + member
// Events are dated relative to "now" so the home / events / past pages always show
// a live event, upcoming events, and attendance history without a live backend.

const DAY_MS = 86_400_000;
const PACIFIC_TZ = "America/Los_Angeles";

// Event organizers, referenced by FullEvent.creator_id (GET /members/{id} → {id, name}).
const MOCK_EVENT_ORGANIZERS: Record<string, ProjectMember> = {
  "org-1": { id: "org-1", name: "Alex Rivera" },
  "org-2": { id: "org-2", name: "Priya Nair" },
  "org-3": { id: "org-3", name: "Tyler Brooks" },
};

export function mockOrganizer(memberId: string): ProjectMember {
  return MOCK_EVENT_ORGANIZERS[memberId] ?? { id: memberId, name: "Chapter organizer" };
}

interface EventSeed {
  id: string;
  name: string;
  type: EventType;
  offsetDays: number;
  location: string;
  creator_id: string;
  description: string;
  tags: string[];
  durationMin?: number;
}

function seedEvent({ durationMin = 90, offsetDays, ...rest }: EventSeed): FullEvent {
  const start = Date.now() + offsetDays * DAY_MS;
  return {
    ...rest,
    timezone: PACIFIC_TZ,
    start_at: new Date(start).toISOString(),
    end_at: new Date(start + durationMin * 60_000).toISOString(),
  };
}

// GET /events → KanaePages<FullEvents>. offsetDays 0 is live now (check-in open).
export const MOCK_EVENTS: FullEvent[] = [
  seedEvent({
    id: "e-live",
    name: "General Meeting #4",
    type: "general",
    offsetDays: 0,
    location: "COB 120",
    creator_id: "org-1",
    tags: ["Career"],
    description:
      "Mid-semester chapter sync — project demos, SIG updates, and check-in is live now.",
  }),
  seedEvent({
    id: "e-rust",
    name: "Intro to Rust",
    type: "sig_swe",
    offsetDays: 2,
    location: "COB 110",
    creator_id: "org-3",
    tags: ["Workshop", "Beginner", "Hands-on"],
    description: "Ownership, borrowing, and your first CLI in Rust. No systems experience needed.",
  }),
  seedEvent({
    id: "e-ctf",
    name: "CTF Practice Night",
    type: "sig_cyber",
    offsetDays: 4,
    location: "SE2 110",
    creator_id: "org-1",
    tags: ["Security", "Hands-on"],
    description: "Sharpen crypto, web, and reversing skills before the regional CTF.",
  }),
  seedEvent({
    id: "e-d3",
    name: "Data Viz with D3",
    type: "sig_data",
    offsetDays: 6,
    location: "COB 263",
    creator_id: "org-2",
    tags: ["Workshop", "Hands-on"],
    description: "Build interactive charts from real UC Merced enrollment data using D3.js.",
  }),
  seedEvent({
    id: "e-mixer",
    name: "Resume & Internship Mixer",
    type: "social",
    offsetDays: 9,
    location: "COB 263",
    creator_id: "org-2",
    tags: ["Career"],
    description: "Bring your laptop and questions — alumni and recruiters will review resumes.",
    durationMin: 120,
  }),
  seedEvent({
    id: "e-ml",
    name: "Intro to Machine Learning",
    type: "sig_ai",
    offsetDays: -2,
    location: "COB 110",
    creator_id: "org-2",
    tags: ["Machine Learning", "Beginner", "Hands-on"],
    description: "A hands-on intro to ML concepts with the AI SIG — no experience needed.",
  }),
  seedEvent({
    id: "e-gfx",
    name: "Graphics Jam: Shaders 101",
    type: "sig_graph",
    offsetDays: -5,
    location: "SE1 138",
    creator_id: "org-3",
    tags: ["Hands-on"],
    description: "Write your first fragment shaders and render a procedural scene from scratch.",
  }),
  seedEvent({
    id: "e-react",
    name: "Intro to React Workshop",
    type: "sig_swe",
    offsetDays: -12,
    location: "COB 263",
    creator_id: "org-3",
    tags: ["React", "Workshop", "Beginner"],
    description: "Hands-on overview of React — components, hooks, and state.",
  }),
  seedEvent({
    id: "e-gm3",
    name: "General Meeting #3",
    type: "general",
    offsetDays: -25,
    location: "COB 120",
    creator_id: "org-1",
    tags: [],
    description: "Chapter updates, upcoming events, and a look at this semester's projects.",
  }),
];

const PLANNED_IDS = new Set(["e-d3", "e-live", "e-ml", "e-react", "e-rust"]);
const ATTENDED_IDS = new Set(["e-gm3", "e-ml", "e-react"]);

// GET /members/me/events?planned=true / ?attended=true
export const MOCK_PLANNED_EVENTS: FullEvent[] = MOCK_EVENTS.filter((event) =>
  PLANNED_IDS.has(event.id),
);
export const MOCK_ATTENDED_EVENTS: FullEvent[] = MOCK_EVENTS.filter((event) =>
  ATTENDED_IDS.has(event.id),
);

// GET /members/me → ClientMember. Seeded as an admin so the dashboard shows the
// full operator experience (Admin access, event attendance QR + roster).
export const MOCK_ME: ClientMember = {
  id: MOCK_CURRENT_USER.id,
  name: MOCK_CURRENT_USER.name,
  email: "jkim@ucmerced.edu",
  display_name: "jkim",
  created_at: "2023-08-21T00:00:00Z",
  projects: MOCK_MEMBER_PROJECTS,
  events: MOCK_PLANNED_EVENTS,
  roles: ["admin"],
  session: {
    aal: "aal1",
    active: true,
    authenticated_at: new Date().toISOString(),
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + DAY_MS).toISOString(),
  },
};

// GET /events/{id}/attendance → KanaePages<AttendanceMember> (admin roster view).
const ROSTER_POOL = [
  "Alex Rivera",
  "Priya Nair",
  "Lena Kovac",
  "Omar Tariq",
  "Maya Lopez",
  "Chen Hu",
  "Tyler Brooks",
  "Noah Williams",
  "Aisha Patel",
  "Sofia Gomez",
];

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function hashString(value: string): number {
  let hash = 0;
  for (const char of value) hash = (hash + (char.codePointAt(0) ?? 0)) % 100_000;
  return hash;
}

// GET /events/{id}/attendance-code → the 8-char code the organizer renders as a QR.
export function mockAttendanceCode(eventId: string): { code: string } {
  const base = hashString(eventId);
  const code = Array.from(
    { length: 8 },
    (_, index) => CODE_ALPHABET[(base * 31 + index * 97) % CODE_ALPHABET.length],
  ).join("");
  return { code };
}

export function mockAttendance(eventId: string): AttendanceMember[] {
  const event = MOCK_EVENTS.find((item) => item.id === eventId);
  const now = Date.now();
  const ended = event ? new Date(event.end_at).getTime() < now : false;
  const started = event ? new Date(event.start_at).getTime() <= now : false;
  const size = 5 + (hashString(eventId) % 5);
  return ROSTER_POOL.slice(0, size).map((name, index) => {
    const planned = index % 4 !== 3;
    let attended = false;
    if (ended) attended = planned ? index % 5 !== 4 : index % 3 === 0;
    else if (started) attended = planned && index % 2 === 0;
    return { id: `att-${eventId}-${String(index)}`, name, planned, attended };
  });
}
