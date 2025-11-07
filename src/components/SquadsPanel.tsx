"use client";

import { format } from "date-fns";
import styles from "@/styles/SquadsPanel.module.css";
import type { Person, Squad } from "@/types";

interface SquadsPanelProps {
  squads: Squad[];
  people: Person[];
}

const lookupName = (people: Person[], id: string | undefined) => {
  if (!id) return "Unassigned";
  const person = people.find((candidate) => candidate.personId === id);
  return person ? `${person.firstName} ${person.lastName}` : "Unknown";
};

const formatDate = (value?: string) => (value ? format(new Date(value), "dd MMM yyyy") : "–");

export const SquadsPanel = ({ squads, people }: SquadsPanelProps) => {
  return (
    <div className={styles.wrapper}>
      <header>
        <h2>Virtual Squads</h2>
        <p>Cross-functional teams with allocation guardrails.</p>
      </header>
      <div className={styles.grid}>
        {squads.map((squad) => {
          const totalAllocation = squad.members.reduce((sum, member) => sum + member.allocation, 0);
          const overAllocated = totalAllocation > 1.5;
          return (
            <article key={squad.squadId} className={styles.card} data-status={squad.status}>
              <header>
                <h3>{squad.name}</h3>
                <span className={styles.status}>{squad.status}</span>
              </header>
              <p>{squad.objective}</p>
              <dl className={styles.meta}>
                <div>
                  <dt>Owner</dt>
                  <dd>{lookupName(people, squad.ownerId)}</dd>
                </div>
                <div>
                  <dt>Initiative</dt>
                  <dd>{squad.relatedInitiative ?? "–"}</dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>
                    {formatDate(squad.startDate)} → {formatDate(squad.endDate)}
                  </dd>
                </div>
              </dl>
              <section>
                <h4>Members</h4>
                <ul>
                  {squad.members.map((member) => (
                    <li key={`${member.squadId}-${member.personId}`}>
                      <strong>{lookupName(people, member.personId)}</strong>
                      <span>
                        {member.roleInSquad} · {(member.allocation * 100).toFixed(0)}% allocation
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
              <footer className={styles.footer}>
                <span>Total allocation</span>
                <strong className={overAllocated ? styles.overAllocation : ""}>
                  {(totalAllocation * 100).toFixed(0)}%
                </strong>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
};
