"use client";

import { useMemo, useState } from "react";
import { currentActivePeople, currentAlumni, currentExitRecords, currentHiringNeeds, currentRoles, currentSquads } from "@/lib/analytics";
import type { EmploymentStatus, Person } from "@/types";
import { Dashboard } from "./Dashboard";
import { EmployeeJourney } from "./EmployeeJourney";
import { HiringBoard } from "./HiringBoard";
import { OrgChart } from "./OrgChart";
import { PeopleRoster } from "./PeopleRoster";
import { SquadsPanel } from "./SquadsPanel";
import styles from "@/styles/AppShell.module.css";

const tabs = [
  "Overview",
  "People",
  "Organisation",
  "Squads",
  "Hiring",
  "Journey",
] as const;

export type Tab = (typeof tabs)[number];

export const AppShell = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("Overview");
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus[]>([
    "Active",
    "Onboarding",
  ]);

  const roster = useMemo(() => {
    const data: Person[] = statusFilter.includes("Alumni")
      ? [...currentActivePeople, ...currentAlumni.map((record) => ({
          personId: record.personId,
          firstName: "Alumni",
          lastName: record.alumniId,
          email: record.alumniEmail ?? `${record.personId}@alumni.peopleflow.app`,
          locationId: "alumni",
          employmentStatus: "Alumni" as const,
          fte: 0,
          dottedLineManagerIds: [],
          skills: [],
          careerHistory: [],
          assignedSquadIds: [],
          createdAt: record.joinedDate,
          updatedAt: record.leftDate,
        }))]
      : currentActivePeople;

    return data.filter((person) => statusFilter.includes(person.employmentStatus));
  }, [statusFilter]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.badge}>Beta</p>
          <h1>PeopleFlow Control Centre</h1>
          <p className={styles.subtitle}>
            A single system of record for people, organisation management, squads, and hiring.
          </p>
        </div>
      </header>

      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === selectedTab ? styles.activeTab : styles.tab}
            onClick={() => setSelectedTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className={styles.content}>
        {selectedTab === "Overview" && (
          <Dashboard
            people={roster}
            hiringNeeds={currentHiringNeeds}
            roles={currentRoles}
            exitRecords={currentExitRecords}
            squads={currentSquads}
            onStatusToggle={(status) =>
              setStatusFilter((prev) =>
                prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
              )
            }
            selectedStatuses={statusFilter}
          />
        )}
        {selectedTab === "People" && (
          <PeopleRoster
            people={roster}
            onStatusToggle={(status) =>
              setStatusFilter((prev) =>
                prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
              )
            }
            selectedStatuses={statusFilter}
          />
        )}
        {selectedTab === "Organisation" && <OrgChart people={roster} />}
        {selectedTab === "Squads" && <SquadsPanel squads={currentSquads} people={roster} />}
        {selectedTab === "Hiring" && <HiringBoard hiringNeeds={currentHiringNeeds} roles={currentRoles} />}
        {selectedTab === "Journey" && <EmployeeJourney people={roster} exitRecords={currentExitRecords} />}
      </section>
    </div>
  );
};
