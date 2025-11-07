import { readFile } from 'fs/promises';
import path from 'path';

export interface MarkdownHeading {
  level: number;
  text: string;
}

const README_PATH = path.join(process.cwd(), 'README.md');

export async function loadReadme(): Promise<string> {
  return readFile(README_PATH, 'utf-8');
}

export async function extractHeadings(): Promise<MarkdownHeading[]> {
  const contents = await loadReadme();
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;
  const headings: MarkdownHeading[] = [];

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(contents)) !== null) {
    const [, hashes, text] = match;
    headings.push({
      level: hashes.length,
      text: text.trim(),
    });
  }

  return headings;
}

export function hasHeading(headings: MarkdownHeading[], expected: MarkdownHeading): boolean {
  return headings.some((heading) => heading.level === expected.level && heading.text === expected.text);
}
