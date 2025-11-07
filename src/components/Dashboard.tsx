"use client";

import { buildHeadcountSummary, buildHiringPipeline, computeSquadLoads } from "@/lib/analytics";
import type { EmploymentStatus, HiringNeed, Person, Role, Squad } from "@/types";
import styles from "@/styles/Dashboard.module.css";
import { format } from "date-fns";
import type { ExitRecord } from "@/types";

interface DashboardProps {
  people: Person[];
  hiringNeeds: HiringNeed[];
  roles: Role[];
  squads: Squad[];
  exitRecords: ExitRecord[];
  selectedStatuses: EmploymentStatus[];
  onStatusToggle: (status: EmploymentStatus) => void;
}

const formatDate = (value?: string) => (value ? format(new Date(value), "dd MMM yyyy") : "–");

export const Dashboard = ({
  people,
  hiringNeeds,
  roles,
  squads,
  exitRecords,
  selectedStatuses,
  onStatusToggle,
}: DashboardProps) => {
  const headcount = buildHeadcountSummary(people);
  const hiringPipeline = buildHiringPipeline(hiringNeeds);
  const squadLoads = computeSquadLoads(squads);

  return (
    <div className={styles.grid}>
      <section className={styles.card}>
        <header>
          <h2>Headcount</h2>
          <p>Toggle the employment states to focus the analytics.</p>
        </header>
        <div className={styles.badges}>
          {(Object.keys(headcount.byStatus) as EmploymentStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusToggle(status)}
              className={selectedStatuses.includes(status) ? styles.badgeActive : styles.badge}
            >
              {status} · {headcount.byStatus[status] ?? 0}
            </button>
          ))}
        </div>
        <div className={styles.metrics}>
          <div>
            <span className={styles.metricLabel}>Total People</span>
            <strong className={styles.metricValue}>{headcount.total}</strong>
          </div>
          {Object.entries(headcount.byLocation).map(([location, count]) => (
            <div key={location}>
              <span className={styles.metricLabel}>{location}</span>
              <strong className={styles.metricValue}>{count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <header>
          <h2>Hiring Pipeline</h2>
          <p>Track approvals through fulfilment.</p>
        </header>
        <ul className={styles.list}>
          {hiringPipeline.map((item) => (
            <li key={item.status}>
              <span>{item.status}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <header>
          <h2>Critical Roles</h2>
          <p>Open headcount with dependencies.</p>
        </header>
        <ul className={styles.list}>
          {roles
            .filter((role) => role.isVacant)
            .map((role) => (
              <li key={role.roleId}>
                <span>
                  {role.title} · {role.department}
                </span>
                <strong>{role.requiredSkills.join(", ")}</strong>
              </li>
            ))}
          {roles.filter((role) => role.isVacant).length === 0 && <li>All roles currently filled.</li>}
        </ul>
      </section>

      <section className={styles.card}>
        <header>
          <h2>Squad Utilisation</h2>
          <p>Ensure allocations do not breach FTE constraints.</p>
        </header>
        <ul className={styles.list}>
          {squadLoads.map((load) => (
            <li key={load.squad.squadId}>
              <span>{load.squad.name}</span>
              <strong>{(load.totalAllocation * 100).toFixed(0)}% utilised</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <header>
          <h2>Recent Exits</h2>
          <p>Monitor attrition trends.</p>
        </header>
        <ul className={styles.list}>
          {exitRecords.map((exit) => (
            <li key={exit.exitId}>
              <span>{exit.reason}</span>
              <strong>
                Last day {formatDate(exit.lastWorkingDay)} · Rehire: {exit.eligibleForRehire ? "Yes" : "No"}
              </strong>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <header>
          <h2>Lifecycle Coverage</h2>
          <p>Ensure onboarding and mobility guardrails are active.</p>
        </header>
        <div className={styles.lifecycle}>
          <div>
            <span className={styles.metricLabel}>Onboarding</span>
            <strong className={styles.metricValue}>
              {people.filter((person) => person.employmentStatus === "Onboarding").length}
            </strong>
          </div>
          <div>
            <span className={styles.metricLabel}>Offboarding</span>
            <strong className={styles.metricValue}>
              {people.filter((person) => person.employmentStatus === "Offboarding").length}
            </strong>
          </div>
          <div>
            <span className={styles.metricLabel}>Candidates</span>
            <strong className={styles.metricValue}>
              {people.filter((person) => person.employmentStatus === "Candidate").length}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
};
