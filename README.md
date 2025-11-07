# PeopleFlow Requirements Specification

## 1. Overview

PeopleFlow is a responsive web application that provides a single source of truth for managing people, organisational structures, reporting relationships, hiring needs, and the complete employee journey from candidate to alumni. The platform must support organisations operating across multiple locations and enable both traditional hierarchies and matrix management, including the creation of virtual squads.

### Implementation Snapshot

The repository now ships with a functional **Next.js 14** prototype that demonstrates the end-to-end PeopleFlow experience:

* **Unified control centre.** A tabbed interface surfaces dashboards, people directories, organisation charts, squad utilisation, hiring kanban, and lifecycle tracking — all seeded with realistic demo data.
* **Client-side analytics.** Headcount, allocation, pipeline, and lifecycle metrics are derived in-browser using the same domain model defined below.
* **Responsive presentation.** Modern CSS modules keep the experience fluid across desktop and tablet breakpoints while aligning to the visual direction of the specification.

The prototype provides the baseline UI/UX requested in the requirements and can be iterated toward production by adding persistence, integrations, and authentication hardening.

### Product Vision

PeopleFlow exists to align workforce planning, daily operations, and long-term growth. By offering a unified operating picture, the platform empowers HR, managers, and executives to understand their people, take decisive action, and forecast capability needs.

### Strategic Goals

1. Deliver a unified, real-time view of the organisation and its people.
2. Streamline lifecycle management, from recruitment and onboarding through to alumni engagement.
3. Offer actionable insights that guide workforce planning and capability development.
4. Provide extensible foundations for integrations, governance, and future modules.

---

## 2. Core Objectives

1. Represent complete organisational structures, including hard and dotted-line relationships.
2. Manage people profiles and the employment lifecycle (Candidate → Employee → Alumni).
3. Enable creation and management of virtual squads and project teams.
4. Track hiring needs, approvals, and role fulfilment.
5. Provide dashboards and analytics for headcount, churn, hiring pipeline, and capacity.
6. Integrate with external HRIS, SSO, and collaboration systems.
7. Maintain full auditability, version control, and data integrity.
8. Ensure an accessible, responsive experience across desktop, tablet, and mobile.

---

## 3. Key Entities and Relationships

### 3.1 Entity Overview

| Entity        | Summary                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------- |
| Person        | Core representation of an individual across their employment lifecycle.                      |
| Location      | Physical or virtual work locations with regional metadata.                                   |
| Role          | Organisational positions, filled or vacant, linked to hiring needs.                          |
| HiringNeed    | Workflow-managed requests to fill or backfill a role.                                        |
| Squad         | Cross-functional groupings aligned to initiatives.                                           |
| SquadMember   | Join records between people and squads with allocation tracking.                             |
| CareerEvent   | Historical record of key employment milestones and changes.                                  |
| ExitRecord    | Structured documentation for offboarding events.                                             |
| Alumni        | Post-employment representation for ongoing engagement.                                       |
| AuditTrail    | Immutable log of data mutations for governance and compliance.                               |

### 3.2 Entity Definitions

#### Person

| Attribute                 | Type / Notes                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| person_id                 | UUID (PK)                                                                    |
| first_name, last_name     | Strings                                                                      |
| preferred_name            | String                                                                       |
| email, phone              | Strings                                                                      |
| location_id               | FK → Location                                                                |
| employment_status         | Enum: Candidate \| Active \| Onboarding \| Offboarding \| Alumni            |
| start_date, end_date      | Dates                                                                        |
| job_title, grade          | Strings                                                                      |
| cost_centre               | String                                                                       |
| full_time_equivalent      | Decimal (0–1)                                                                |
| manager_id                | FK → Person (hard line)                                                      |
| dotted_line_manager_ids   | Array[Person]                                                                |
| skills                    | Array[String]                                                                |
| career_history            | Array[CareerEvent]                                                           |
| assigned_squads           | Array[Squad]                                                                 |
| profile_photo_url         | String (URL)                                                                 |
| created_at, updated_at    | Timestamps                                                                   |

#### Location

| Attribute   | Type / Notes                  |
| ----------- | ---------------------------- |
| location_id | UUID (PK)                    |
| name        | String (e.g. London)         |
| country     | String                       |
| region      | String                       |
| timezone    | String                       |
| active_flag | Boolean                      |

#### Role

| Attribute        | Type / Notes                                           |
| ---------------- | ----------------------------------------------------- |
| role_id          | UUID (PK)                                             |
| title            | String                                                |
| department       | String                                                |
| grade_level      | String                                                |
| cost_centre      | String                                                |
| required_skills  | Array[String]                                         |
| is_vacant        | Boolean                                               |
| person_id        | FK → Person (nullable)                                |
| hiring_need_id   | FK → HiringNeed (nullable)                            |

#### HiringNeed

| Attribute                | Type / Notes                                             |
| ------------------------ | ------------------------------------------------------- |
| hiring_need_id           | UUID (PK)                                               |
| created_by               | FK → Person                                             |
| role_id                  | FK → Role                                               |
| location_id              | FK → Location                                           |
| justification_text       | Text                                                    |
| approval_status          | Enum: Requested \| Approved \| Sourcing \| Filled \| Withdrawn |
| opened_date, closed_date | Dates                                                   |
| internal_candidate_ids   | Array[Person]                                           |
| external_candidate_source| String                                                  |
| filled_by                | FK → Person (nullable)                                  |

#### Squad

| Attribute         | Type / Notes                                           |
| ----------------- | ----------------------------------------------------- |
| squad_id          | UUID (PK)                                             |
| name              | String                                                |
| objective         | Text                                                  |
| start_date        | Date                                                  |
| end_date          | Date (nullable)                                       |
| owner_id          | FK → Person                                           |
| members           | Array[SquadMember]                                    |
| related_initiative| String                                                |
| status            | Enum: Active \| Paused \| Closed                      |

#### SquadMember

| Attribute      | Type / Notes                             |
| -------------- | --------------------------------------- |
| person_id      | FK → Person                              |
| squad_id       | FK → Squad                               |
| role_in_squad  | String                                   |
| allocation     | Decimal (0–1)                            |
| join_date      | Date                                     |
| leave_date     | Date (nullable)                          |

#### CareerEvent

| Attribute  | Type / Notes                                           |
| ---------- | ----------------------------------------------------- |
| event_id   | UUID (PK)                                             |
| person_id  | FK → Person                                           |
| event_type | Enum: Promotion \| Transfer \| RoleChange \| Review \| Exit |
| event_date | Date                                                  |
| details    | JSON                                                  |

#### ExitRecord

| Attribute         | Type / Notes                                   |
| ----------------- | --------------------------------------------- |
| exit_id           | UUID (PK)                                     |
| person_id         | FK → Person                                   |
| reason            | Enum: Resignation \| Termination \| Retirement \| Redundancy |
| notice_date       | Date                                          |
| last_working_day  | Date                                          |
| exit_feedback     | Text                                          |
| eligible_for_rehire | Boolean                                    |

#### Alumni

| Attribute          | Type / Notes                            |
| ------------------ | -------------------------------------- |
| alumni_id          | UUID (PK)                               |
| person_id          | FK → Person                             |
| rehire_eligible    | Boolean                                 |
| joined_date        | Date                                    |
| left_date          | Date                                    |
| alumni_email       | String (nullable)                       |
| participation_status | Enum: Active \| Dormant               |

#### AuditTrail

| Attribute    | Type / Notes                                   |
| ------------ | --------------------------------------------- |
| audit_id     | UUID (PK)                                     |
| entity_name  | String                                        |
| entity_id    | String / UUID                                 |
| action_type  | Enum: CREATE \| UPDATE \| DELETE              |
| changed_by   | FK → Person                                   |
| timestamp    | Timestamp                                     |
| before_state | JSON                                          |
| after_state  | JSON                                          |

---

## 4. Functional Requirements

### 4.1 Organisation Management

* Display an interactive org chart supporting hierarchy and matrix views.
* Toggle views by location, department, manager, or squad.
* Provide drill-down navigation from executive level to individual contributor.
* Create, update, and retire roles with validation of reporting lines.
* Visualise hard and dotted-line relationships distinctly.

### 4.2 People Management

* Full CRUD operations for people profiles with lifecycle state transitions.
* Track employment history and key events via CareerEvent records.
* Assign managers, dotted-line relationships, locations, and squads.
* Import/export people data in CSV and JSON formats.
* Present timeline views of each employee journey.

### 4.3 Squad Management

* Create and edit squads with objectives, timeframes, and owners.
* Manage membership allocations to avoid exceeding 1.0 FTE per person across squads.
* Visualise resource commitments and overlaps.
* Link squads to initiatives, hiring needs, or strategic priorities.

### 4.4 Hiring Needs

* Initiate hiring requests with justification and associated role/location.
* Support multi-step approvals with audit logging.
* Track internal and external candidates and their progress.
* Auto-transition roles to "filled" when onboarding completes.
* Provide dashboards for open roles, fill rates, and ageing requisitions.

### 4.5 Employee Journey

* Pre-boarding: manage document collection, access provisioning, and buddy assignments.
* Onboarding: capture tasks, introductions, and early goal-setting.
* Development: record skills, training, mentoring, and performance reviews.
* Mobility: support transfers, promotions, and secondments.
* Offboarding: gather exit feedback, manage deprovisioning, and final tasks.
* Alumni: maintain engagement, referral programs, and rehire tracking.

### 4.6 Insights & Dashboards

* Headcount and distribution by location, department, employment status, and squad.
* Attrition analytics, including voluntary vs involuntary trends and forecasts.
* Hiring pipeline visibility with conversion rates and bottleneck alerts.
* Skills inventory analysis to identify capability gaps and development needs.
* Squad capacity and utilisation reporting with export and subscription options.

### 4.7 Governance & Security

* Role-based access control for HR, managers, squad owners, and employees.
* SSO via Azure AD / OAuth 2.0 with MFA support.
* Immutable audit logging for all create/update/delete operations.
* GDPR compliance through data retention policies and anonymisation workflows.
* Configurable data residency and backup schedules.

---

## 5. Non-Functional Requirements

| Category        | Requirement                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| Performance     | ≤ 2s page load, ≤ 1s API response for datasets under 1,000 records.        |
| Scalability     | Scale to 10,000 employees, 500 squads, and 5 concurrent business units.     |
| Availability    | 99.9% uptime with active monitoring and automated recovery.                 |
| Security        | RBAC, encryption at rest and in transit, periodic penetration testing.     |
| UI/UX           | Responsive, accessible (WCAG 2.1 AA), localisation ready.                   |
| Interoperability| Integrate with Workday, Microsoft Teams, payroll, and identity providers.   |
| Extensibility   | Modular architecture with versioned APIs and plugin capability.            |
| Compliance      | Support ISO 27001 controls and audit-ready reporting.                       |

---

## 6. Architecture Guidance

### 6.1 Reference Implementation

| Layer          | Technology (prototype)                                             | Production Considerations                                  |
| -------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Frontend       | **Next.js 14 + React 18**, CSS Modules for responsive styling      | Add design system, Storybook, localisation, accessibility  |
| Backend        | Next.js App Router with in-memory domain model                     | Graduate to NestJS/.NET services backed by PostgreSQL       |
| API            | Client-side selectors (no network hop in prototype)                | Expose REST + GraphQL endpoints with OpenAPI contracts     |
| Data           | Static seed data bundled in the repo                               | Managed PostgreSQL + Redis cache, S3/Blob for documents     |
| Authentication | Not implemented (demo data only)                                   | Azure AD / Okta SSO with role-based access control         |
| Hosting        | `next dev` for local preview                                       | Containerised deployment on Azure App Service / AWS Fargate|
| CI/CD          | GitHub Actions (Stagehand validated)                               | Multi-environment pipelines with quality gates              |
| Observability  | Browser console + Playwright smoke tests                           | Centralised logging, metrics, APM via Application Insights |

### 6.2 Running the PeopleFlow Prototype

```bash
npm install        # downloads Next.js, React, and Playwright dependencies
npm run dev        # launches the Next.js development server on http://localhost:3000

# Optional quality automation
npm run lint
npm run test:e2e
```

The prototype persists data in memory for demonstration purposes. Extend the data layer by wiring API routes or server actions to PostgreSQL once infrastructure is provisioned.

---

## 7. API Blueprint

### Core Endpoints

```
GET    /api/people
GET    /api/people/:id
POST   /api/people
PATCH  /api/people/:id
DELETE /api/people/:id

GET    /api/orgchart
GET    /api/locations
GET    /api/squads
POST   /api/squads
POST   /api/hiring-needs
PATCH  /api/hiring-needs/:id
GET    /api/dashboards/headcount
```

### Workflow Hooks

* Webhooks for lifecycle transitions (e.g., onboarding completed, role filled).
* Scheduled jobs for data synchronisation with HRIS and collaboration tools.
* Event-driven notifications (email, Teams, Slack) for approvals and status changes.

---

## 8. Data Integrity & Workflow Rules

1. Each person must have exactly one hard-line manager (except top-level executives) and may have multiple dotted-line managers.
2. A role can be associated with only one active person at a time.
3. Each hiring need references exactly one role; closing the hiring need updates associated role status.
4. When a person's employment_status transitions to `Alumni`, an Alumni record is created and active access is revoked.
5. All entity changes trigger AuditTrail records capturing before/after states.
6. Squad membership allocations per person must not exceed a combined 1.0 FTE across squads.
7. Data imports must pass validation rules for mandatory fields, FTE limits, and manager hierarchies.
8. Deleting entities requires soft-delete patterns to preserve historical reporting.

---

## 9. Success Metrics

* Time-to-fill reduction by 20% through streamlined hiring workflows.
* Improved manager satisfaction (CSAT ≥ 4.5/5) regarding workforce visibility.
* Reduction in manual reporting effort by automating dashboards and data exports.
* Compliance audit findings resolved within two weeks of identification.

---

## 10. Future Enhancements

* Workforce planning scenarios and headcount forecasting.
* Integration with learning management systems for training completion tracking.
* AI-driven skills matching and internal mobility recommendations.
* Mobile app for on-the-go approvals and notifications.

---

## 11. Quality Engineering & Automation

### 11.1 Playwright Test Suite

To keep the specification regression-safe as it evolves into a working product, the repository now includes a lightweight **Playwright** harness. The inaugural suite smoke-tests the documentation itself, ensuring that foundational sections covering the organisational model, lifecycle, and governance remain intact.

**Key files**

| Path | Purpose |
| ---- | ------- |
| `package.json` | Node project definition with Playwright + TypeScript dev dependencies and npm scripts. |
| `playwright.config.ts` | Shared Playwright configuration (multi-browser projects, retries, and reporting). |
| `tests/e2e/requirements.spec.ts` | Smoke tests that assert the presence of critical content within the requirements specification. |
| `tests/e2e/stagehand.spec.ts` | Guards the Stagehand workflow structure and documentation guidance. |
| `stagehand.config.yml` | Stagehand workflow that provisions dependencies and executes the Playwright suite in automation. |

### 11.2 Local Execution

```bash
npm install
npx playwright install --with-deps
npm run test:e2e
```

The configuration honours an optional `PEOPLEFLOW_BASE_URL` environment variable so the suite can seamlessly shift from documentation checks to real UI flows once an application exists. Default list + HTML reporters, traces on first retry, and failure screenshots are enabled to aid debugging.

### 11.3 Stagehand Integration

The repository ships with a `stagehand.config.yml` aligned to the [Stagehand “First Steps” guide](https://docs.stagehand.dev/first-steps/introduction). After installing the Stagehand CLI, you can validate and execute the workflow locally:

```bash
npx stagehand validate
npx stagehand run
```

Stagehand performs the same steps defined in CI/CD: install dependencies, install browsers, run the Playwright suite, and publish Playwright’s HTML report plus raw traces as artifacts. Override `PEOPLEFLOW_BASE_URL` within Stagehand to target preview environments or production instances.

> **Note:** If direct access to the Stagehand documentation is blocked in your environment, request the offline onboarding bundle from your platform administrator. The configuration provided here follows the defaults called out in the public guide.
