import { alumni, exitRecords, hiringNeeds, locations, people, roles, squads } from "@/data/sampleData";
import { EmploymentStatus, HiringNeed, Person, Squad } from "@/types";

export interface HeadcountSummary {
  total: number;
  byLocation: Record<string, number>;
  byStatus: Record<EmploymentStatus, number>;
}

export const buildHeadcountSummary = (population: Person[] = people): HeadcountSummary => {
  return population.reduce(
    (acc, person) => {
      acc.total += person.employmentStatus !== "Alumni" ? 1 : 0;
      const locationName = locations.find((loc) => loc.locationId === person.locationId)?.name ?? "Unknown";
      acc.byLocation[locationName] = (acc.byLocation[locationName] ?? 0) + 1;
      acc.byStatus[person.employmentStatus] = (acc.byStatus[person.employmentStatus] ?? 0) + 1;
      return acc;
    },
    {
      total: 0,
      byLocation: {} as Record<string, number>,
      byStatus: {
        Candidate: 0,
        Active: 0,
        Onboarding: 0,
        Offboarding: 0,
        Alumni: 0,
      },
    }
  );
};

export interface HiringPipelineDatum {
  status: string;
  count: number;
}

export const buildHiringPipeline = (needs: HiringNeed[] = hiringNeeds): HiringPipelineDatum[] => {
  const buckets = needs.reduce<Record<string, number>>((acc, need) => {
    acc[need.approvalStatus] = (acc[need.approvalStatus] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(buckets).map(([status, count]) => ({ status, count }));
};

export interface SquadLoad {
  squad: Squad;
  totalAllocation: number;
}

export const computeSquadLoads = (squadList: Squad[] = squads): SquadLoad[] =>
  squadList.map((squad) => ({
    squad,
    totalAllocation: squad.members.reduce((sum, member) => sum + member.allocation, 0),
  }));

export const currentActivePeople = people.filter((person) =>
  ["Active", "Onboarding", "Candidate", "Offboarding"].includes(person.employmentStatus)
);

export const currentRoles = roles;
export const currentHiringNeeds = hiringNeeds;
export const currentSquads = squads;
export const currentAlumni = alumni;
export const currentExitRecords = exitRecords;
