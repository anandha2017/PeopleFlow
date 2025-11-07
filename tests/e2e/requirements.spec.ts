import { expect, test } from '@playwright/test';
import { extractHeadings, hasHeading, loadReadme } from '../utils/markdown';

const canonicalSections = [
  { level: 2, text: '1. Overview' },
  { level: 2, text: '2. Core Objectives' },
  { level: 2, text: '3. Key Entities and Relationships' },
  { level: 2, text: '4. Functional Requirements' },
  { level: 2, text: '5. Non-Functional Requirements' },
  { level: 2, text: '6. Architecture Guidance' },
  { level: 2, text: '7. API Blueprint' },
  { level: 2, text: '8. Data Integrity & Workflow Rules' },
];

const entityHeadings = [
  'Person',
  'Location',
  'Role',
  'HiringNeed',
  'Squad',
  'SquadMember',
  'CareerEvent',
  'ExitRecord',
  'Alumni',
  'AuditTrail',
];

test.describe('PeopleFlow requirements documentation', () => {
  test('README preserves canonical section headings and ordering', async () => {
    const headings = await extractHeadings();
    const indices = canonicalSections.map((expected) => {
      expect.soft(hasHeading(headings, expected)).toBeTruthy();
      return headings.findIndex((heading) => heading.level === expected.level && heading.text === expected.text);
    });

    const isInOrder = indices.every((index, position) => index !== -1 && (position === 0 || index > indices[position - 1]));
    expect(isInOrder).toBeTruthy();
  });

  test('README details lifecycle and governance commitments', async () => {
    const contents = await loadReadme();
    expect(contents).toMatch(/Candidate → .*? → Alumni/);
    expect(contents).toContain('matrix management');
    expect(contents).toContain('virtual squads');
    expect(contents).toContain('AuditTrail');
  });

  test('README maintains entity attribute definitions', async () => {
    const contents = await loadReadme();

    for (const entity of entityHeadings) {
      expect.soft(contents).toContain(`#### ${entity}`);
      expect.soft(contents).toMatch(new RegExp(`#### ${entity}[\s\S]*?\| Attribute`, 'm'));
    }
  });
});
