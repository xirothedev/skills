import { buildAdapters } from "./adapters";
import { buildAgentsDocument } from "./agents";
import { writeTestCases } from "./test-cases";
import { listSkillNames } from "../../../src/paths";

export async function buildAll(skillName?: string): Promise<void> {
  const skills = skillName ? [skillName] : listSkillNames();
  for (const skill of skills) {
    await buildAgentsDocument(skill);
    await writeTestCases(skill);
    await buildAdapters(skill);
  }
}
