import { join } from "node:path";
import { datasetDir, skillDir } from "../../../src/paths";
import { readText, writeText } from "../../../src/fs-utils";
import { loadRules } from "../../../src/rules";

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

export async function extractTestCases(skillName: string): Promise<TestCase[]> {
  const rules = await loadRules(skillName);
  const cases: TestCase[] = [];

  for (const rule of rules) {
    if (!rule.dataset) continue;
    const datasetPath = join(datasetDir(skillName), rule.dataset);
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
      prompt: `Use $${skillName} to improve this code according to ${rule.id}.`,
      incorrect,
      correct,
      notes,
    });
  }

  return cases;
}

export async function writeTestCases(skillName: string): Promise<void> {
  const cases = await extractTestCases(skillName);
  await writeText(join(skillDir(skillName), "test-cases.json"), `${JSON.stringify(cases, null, 2)}\n`);
}
