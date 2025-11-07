"use client";

import { useMemo } from "react";
import type { Person } from "@/types";
import styles from "@/styles/OrgChart.module.css";

interface OrgChartProps {
  people: Person[];
}

interface OrgNode {
  person: Person;
  reports: OrgNode[];
  dottedReports: OrgNode[];
}

const buildTree = (people: Person[]): OrgNode[] => {
  const byManager = new Map<string | undefined, Person[]>();
  people.forEach((person) => {
    const managerKey = person.managerId ?? "root";
    const bucket = byManager.get(managerKey) ?? [];
    bucket.push(person);
    byManager.set(managerKey, bucket);
  });

  const findNode = (person: Person, trail: Set<string>): OrgNode => {
    const nextTrail = new Set(trail).add(person.personId);
    const reports = (byManager.get(person.personId) ?? []).map((report) => findNode(report, nextTrail));
    const dottedReports = people.filter((candidate) =>
      candidate.dottedLineManagerIds.includes(person.personId) && !nextTrail.has(candidate.personId)
    );
    return {
      person,
      reports,
      dottedReports: dottedReports.map((candidate) => findNode(candidate, nextTrail)),
    };
  };

  return (byManager.get("root") ?? []).map((person) => findNode(person, new Set()));
};

const PersonCard = ({ node }: { node: OrgNode }) => (
  <div className={styles.person}>
    <strong>
      {node.person.firstName} {node.person.lastName}
    </strong>
    <span>{node.person.jobTitle ?? "Role pending"}</span>
    <span className={styles.meta}>{node.person.locationId}</span>
  </div>
);

const DottedBadge = ({ node }: { node: OrgNode }) => (
  <div className={styles.dotted}>
    <span>···</span>
    <PersonCard node={node} />
  </div>
);

const OrgBranch = ({ node }: { node: OrgNode }) => (
  <li>
    <PersonCard node={node} />
    {(node.reports.length > 0 || node.dottedReports.length > 0) && (
      <div className={styles.branches}>
        {node.reports.length > 0 && (
          <ul className={styles.children}>
            {node.reports.map((report) => (
              <OrgBranch key={report.person.personId} node={report} />
            ))}
          </ul>
        )}
        {node.dottedReports.length > 0 && (
          <div className={styles.dottedList}>
            {node.dottedReports.map((report) => (
              <DottedBadge key={`dotted-${report.person.personId}`} node={report} />
            ))}
          </div>
        )}
      </div>
    )}
  </li>
);

export const OrgChart = ({ people }: OrgChartProps) => {
  const tree = useMemo(() => buildTree(people), [people]);

  if (tree.length === 0) {
    return <p>No organisation data available.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <header>
        <h2>Organisation Structure</h2>
        <p>Visualise hard and dotted-line reporting relationships.</p>
      </header>
      <ul className={styles.root}>
        {tree.map((node) => (
          <OrgBranch key={node.person.personId} node={node} />
        ))}
      </ul>
    </div>
  );
};
