import { buildAdapters } from "./adapters";
import { buildAgentsDocument } from "./agents";
import { writeTestCases } from "./test-cases";

export async function buildAll(): Promise<void> {
  await buildAgentsDocument();
  await writeTestCases();
  await buildAdapters();
}
