"use client";

import styles from "@/styles/HiringBoard.module.css";
import { format } from "date-fns";
import type { HiringNeed, Role } from "@/types";

interface HiringBoardProps {
  hiringNeeds: HiringNeed[];
  roles: Role[];
}

const columns = ["Requested", "Approved", "Sourcing", "Filled", "Withdrawn"] as const;

type ColumnKey = (typeof columns)[number];

const formatDate = (value?: string) => (value ? format(new Date(value), "dd MMM") : "–");

export const HiringBoard = ({ hiringNeeds, roles }: HiringBoardProps) => {
  const roleLookup = new Map(roles.map((role) => [role.roleId, role] as const));

  return (
    <div className={styles.wrapper}>
      <header>
        <h2>Hiring Kanban</h2>
        <p>Monitor approvals, sourcing, and fulfilment.</p>
      </header>
      <div className={styles.columns}>
        {columns.map((column) => (
          <section key={column}>
            <header>{column}</header>
            <ul>
              {hiringNeeds
                .filter((need) => need.approvalStatus === column)
                .map((need) => {
                  const role = roleLookup.get(need.roleId);
                  return (
                    <li key={need.hiringNeedId}>
                      <strong>{role?.title ?? "Role TBD"}</strong>
                      <span className={styles.meta}>{role?.department ?? "Unknown"}</span>
                      <span className={styles.meta}>Opened {formatDate(need.openedDate)}</span>
                      {need.closedDate && (
                        <span className={styles.meta}>Closed {formatDate(need.closedDate)}</span>
                      )}
                      <p>{need.justification}</p>
                      {need.internalCandidateIds.length > 0 && (
                        <span className={styles.badge}>
                          Internal candidates: {need.internalCandidateIds.length}
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
