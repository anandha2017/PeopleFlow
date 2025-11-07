import { expect, test } from '@playwright/test';
import { readFile } from 'fs/promises';
import path from 'path';
import { parse } from 'yaml';
import { loadReadme } from '../utils/markdown';

type RunStep = { run: string };
type Artifact = { path: string };

test.describe('Stagehand workflow alignment', () => {
  const configPath = path.join(process.cwd(), 'stagehand.config.yml');

  test('Stagehand config follows first-steps guidance', async () => {
    const file = await readFile(configPath, 'utf-8');
    const config = parse(file) as {
      version?: number;
      workflows?: Record<string, {
        setup?: RunStep[];
        steps?: RunStep[];
        artifacts?: Artifact[];
        environment?: { variables?: Record<string, string> };
      }>;
    };

    const workflow = config.workflows?.default;
    expect(workflow).toBeDefined();
    expect(config.version).toBe(1);
    expect(workflow?.environment?.variables?.PEOPLEFLOW_BASE_URL).toBeTruthy();

    const setupCommands = workflow?.setup?.map((step) => step.run) ?? [];
    expect(setupCommands).toContain('npm install');
    expect(setupCommands.some((command) => command.startsWith('npx playwright install'))).toBeTruthy();

    const executionCommands = workflow?.steps?.map((step) => step.run) ?? [];
    expect(executionCommands).toContain('npm run test:e2e');

    const artifactPaths = workflow?.artifacts?.map((artifact) => artifact.path) ?? [];
    expect(artifactPaths).toEqual(expect.arrayContaining(['playwright-report', 'test-results']));
  });

  test('README instructs engineers to run Stagehand locally', async () => {
    const contents = await loadReadme();
    expect(contents).toContain('npx stagehand validate');
    expect(contents).toContain('npx stagehand run');
  });
});
