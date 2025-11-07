export type EmploymentStatus =
  | "Candidate"
  | "Active"
  | "Onboarding"
  | "Offboarding"
  | "Alumni";

export interface Location {
  locationId: string;
  name: string;
  country: string;
  region: string;
  timezone: string;
  active: boolean;
}

export interface CareerEvent {
  eventId: string;
  personId: string;
  eventType: "Promotion" | "Transfer" | "RoleChange" | "Review" | "Exit";
  eventDate: string;
  details: Record<string, unknown>;
}

export interface Person {
  personId: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  locationId: string;
  employmentStatus: EmploymentStatus;
  startDate?: string;
  endDate?: string;
  jobTitle?: string;
  grade?: string;
  costCentre?: string;
  fte: number;
  managerId?: string;
  dottedLineManagerIds: string[];
  skills: string[];
  careerHistory: CareerEvent[];
  assignedSquadIds: string[];
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  roleId: string;
  title: string;
  department: string;
  gradeLevel: string;
  costCentre?: string;
  requiredSkills: string[];
  isVacant: boolean;
  personId?: string;
  hiringNeedId?: string;
}

export type HiringStatus =
  | "Requested"
  | "Approved"
  | "Sourcing"
  | "Filled"
  | "Withdrawn";

export interface HiringNeed {
  hiringNeedId: string;
  createdBy: string;
  roleId: string;
  locationId: string;
  justification: string;
  approvalStatus: HiringStatus;
  openedDate: string;
  closedDate?: string;
  internalCandidateIds: string[];
  externalCandidateSource?: string;
  filledBy?: string;
}

export interface SquadMember {
  personId: string;
  squadId: string;
  roleInSquad: string;
  allocation: number;
  joinDate: string;
  leaveDate?: string;
}

export interface Squad {
  squadId: string;
  name: string;
  objective: string;
  startDate: string;
  endDate?: string;
  ownerId: string;
  members: SquadMember[];
  relatedInitiative?: string;
  status: "Active" | "Paused" | "Closed";
}

export interface ExitRecord {
  exitId: string;
  personId: string;
  reason: "Resignation" | "Termination" | "Retirement" | "Redundancy";
  noticeDate: string;
  lastWorkingDay: string;
  exitFeedback?: string;
  eligibleForRehire: boolean;
}

export interface Alumni {
  alumniId: string;
  personId: string;
  rehireEligible: boolean;
  joinedDate: string;
  leftDate: string;
  alumniEmail?: string;
  participationStatus: "Active" | "Dormant";
}

export interface AuditEntry<T = Record<string, unknown>> {
  auditId: string;
  entityName: string;
  entityId: string;
  actionType: "CREATE" | "UPDATE" | "DELETE";
  changedBy: string;
  timestamp: string;
  beforeState?: T;
  afterState?: T;
}
