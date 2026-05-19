import { join } from "node:path";
import { DATASET_DIR, SKILL_DIR } from "../paths";
import { readText, writeText } from "../fs-utils";
import { loadRules } from "../rules";

type TestCase = {
  id: string;
  title: string;
  impact: string;
  tags: string[];
  dataset: string;
  prompt: string;
  incorrect: string;
  correct: string;
  notes: string;
};

export async function extractTestCases(): Promise<TestCase[]> {
  const rules = await loadRules();
  const cases: TestCase[] = [];

  for (const rule of rules) {
    const datasetPath = join(DATASET_DIR, rule.dataset);
    const [incorrect, correct, notes] = await Promise.all([
      readText(join(datasetPath, "incorrect.ts")),
      readText(join(datasetPath, "correct.ts")),
      readText(join(datasetPath, "notes.md")),
    ]);

    cases.push({
      id: rule.id,
      title: rule.title,
      impact: rule.impact,
      tags: rule.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      dataset: rule.dataset,
      prompt: `Use $nestjs-best-practices to improve this NestJS code according to ${rule.id}.`,
      incorrect,
      correct,
      notes,
    });
  }

  return cases;
}

export async function writeTestCases(): Promise<void> {
  const cases = await extractTestCases();
  await writeText(join(SKILL_DIR, "test-cases.json"), `${JSON.stringify(cases, null, 2)}\n`);
}
