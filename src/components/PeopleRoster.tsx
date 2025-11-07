"use client";

import { useMemo, useState } from "react";
import { locations } from "@/data/sampleData";
import type { EmploymentStatus, Person } from "@/types";
import styles from "@/styles/PeopleRoster.module.css";

interface PeopleRosterProps {
  people: Person[];
  selectedStatuses: EmploymentStatus[];
  onStatusToggle: (status: EmploymentStatus) => void;
}

const searchFields = ["firstName", "lastName", "jobTitle", "email", "skills"] as const;

type SearchableField = (typeof searchFields)[number];

export const PeopleRoster = ({ people, selectedStatuses, onStatusToggle }: PeopleRosterProps) => {
  const [search, setSearch] = useState<string>("");
  const [managerView, setManagerView] = useState<boolean>(false);

  const filtered = useMemo(() => {
    return people.filter((person) => {
      if (!search) return true;
      return searchFields.some((field) => {
        const value = (person as Record<SearchableField, unknown>)[field];
        if (Array.isArray(value)) {
          return value.some((entry) => String(entry).toLowerCase().includes(search.toLowerCase()));
        }
        return String(value ?? "").toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [people, search]);

  const directReports = useMemo(() => {
    if (!managerView) return {} as Record<string, number>;
    return filtered.reduce<Record<string, number>>((acc, person) => {
      if (!person.managerId) return acc;
      acc[person.managerId] = (acc[person.managerId] ?? 0) + 1;
      return acc;
    }, {});
  }, [filtered, managerView]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h2>People Directory</h2>
          <p>Search, filter, and analyse employment data.</p>
        </div>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search name, role, skill…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <label className={styles.toggle}>
            <input type="checkbox" checked={managerView} onChange={() => setManagerView((prev) => !prev)} />
            Manager utilisation
          </label>
        </div>
      </header>

      <div className={styles.statusFilters}>
        {(["Active", "Onboarding", "Candidate", "Offboarding", "Alumni"] as EmploymentStatus[]).map(
          (status) => (
            <button
              key={status}
              type="button"
              className={selectedStatuses.includes(status) ? styles.filterActive : styles.filter}
              onClick={() => onStatusToggle(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Role</th>
            <th>Location</th>
            <th>Manager</th>
            <th>Skills</th>
            {managerView && <th>Direct reports</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map((person) => (
            <tr key={person.personId}>
              <td>
                <strong>
                  {person.firstName} {person.lastName}
                </strong>
                <div className={styles.subtle}>{person.email}</div>
              </td>
              <td>
                <span className={styles.badge}>{person.employmentStatus}</span>
              </td>
              <td>{person.jobTitle ?? "–"}</td>
              <td>
                {locations.find((location) => location.locationId === person.locationId)?.name ??
                  person.locationId}
              </td>
              <td>{person.managerId ?? "Executive"}</td>
              <td className={styles.skills}>{person.skills.join(", ")}</td>
              {managerView && <td>{directReports[person.personId] ?? 0}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
