"use client";

import { format } from "date-fns";
import styles from "@/styles/EmployeeJourney.module.css";
import type { ExitRecord, Person } from "@/types";

interface EmployeeJourneyProps {
  people: Person[];
  exitRecords: ExitRecord[];
}

const formatDate = (value?: string) => (value ? format(new Date(value), "dd MMM yyyy") : "–");

export const EmployeeJourney = ({ people, exitRecords }: EmployeeJourneyProps) => {
  const onboarding = people.filter((person) => person.employmentStatus === "Onboarding");
  const offboarding = people.filter((person) => person.employmentStatus === "Offboarding");
  const candidates = people.filter((person) => person.employmentStatus === "Candidate");

  return (
    <div className={styles.wrapper}>
      <header>
        <h2>Employee Journey Control</h2>
        <p>Track end-to-end lifecycle from candidate to alumni.</p>
      </header>

      <section>
        <h3>Pre-boarding & Onboarding</h3>
        <ul>
          {onboarding.map((person) => (
            <li key={person.personId}>
              <strong>
                {person.firstName} {person.lastName}
              </strong>
              <span>Start date {formatDate(person.startDate)}</span>
              <span>Manager: {person.managerId ?? "Unassigned"}</span>
              <span>Squads: {person.assignedSquadIds.join(", ") || "None"}</span>
            </li>
          ))}
          {onboarding.length === 0 && <li>No active onboarding journeys.</li>}
        </ul>
      </section>

      <section>
        <h3>Mobility & Development</h3>
        <ul>
          {people
            .filter((person) => person.careerHistory.length > 0)
            .map((person) => (
              <li key={`${person.personId}-career`}>
                <strong>
                  {person.firstName} {person.lastName}
                </strong>
                <span>{person.careerHistory.length} recorded events</span>
                <div className={styles.timeline}>
                  {person.careerHistory.map((event) => (
                    <span key={event.eventId} className={styles.event}>
                      {event.eventType} · {formatDate(event.eventDate)}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          {people.filter((person) => person.careerHistory.length > 0).length === 0 && (
            <li>No recorded mobility events.</li>
          )}
        </ul>
      </section>

      <section>
        <h3>Offboarding & Alumni</h3>
        <ul>
          {offboarding.map((person) => (
            <li key={`${person.personId}-offboarding`}>
              <strong>
                {person.firstName} {person.lastName}
              </strong>
              <span>Last working day {formatDate(person.endDate)}</span>
              <span>Manager: {person.managerId ?? "Unassigned"}</span>
            </li>
          ))}
          {exitRecords.map((exit) => (
            <li key={exit.exitId}>
              <strong>{exit.personId}</strong>
              <span>Reason: {exit.reason}</span>
              <span>Notice: {formatDate(exit.noticeDate)}</span>
              <span>Eligible for rehire: {exit.eligibleForRehire ? "Yes" : "No"}</span>
            </li>
          ))}
          {offboarding.length === 0 && exitRecords.length === 0 && <li>No current offboarding journeys.</li>}
        </ul>
      </section>

      <section>
        <h3>Talent Pipeline</h3>
        <ul>
          {candidates.map((person) => (
            <li key={`${person.personId}-candidate`}>
              <strong>
                {person.firstName} {person.lastName}
              </strong>
              <span>Skills: {person.skills.join(", ") || "TBC"}</span>
              <span>Applied role: {person.jobTitle ?? "–"}</span>
            </li>
          ))}
          {candidates.length === 0 && <li>No active candidates.</li>}
        </ul>
      </section>
    </div>
  );
};
