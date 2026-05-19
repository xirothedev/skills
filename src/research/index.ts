import { join } from "node:path";
import { SOURCES_DIR } from "../paths";
import { writeText } from "../fs-utils";

const sourceInventory = {
  generatedAt: "2026-05-19",
  versionBaseline: {
    framework: "NestJS",
    major: 11,
    version: "v11.1.16",
    discovery: "Context7 /nestjs/nest versions list",
  },
  officialSources: [
    {
      name: "NestJS official docs",
      context7: "/nestjs/docs.nestjs.com",
      purpose: "Conceptual docs for modules, providers, controllers, pipes, guards, interceptors, filters, testing, microservices, GraphQL, configuration, and recipes.",
    },
    {
      name: "NestJS framework repository",
      context7: "/nestjs/nest/v11.1.16",
      purpose: "Versioned samples and implementation references for latest major behavior.",
    },
  ],
  awesomeSources: [
    "nestjs/awesome-nestjs",
    "lvkunpeng/awesome-nestjs",
    "777Vasya77/awesome-nestjs",
    "bhattiasad99/Awesome-NestJS-cheatsheet",
    "Anuar-boop/awesome-nestjs",
  ],
  awesomeSourceDetails: "See sources/awesome-lists.json",
  externalSkillPacks: {
    prisma: "Suggest $find-skills to install the Prisma skill pack for dedicated Prisma guidance.",
  },
  policy: "Prefer official docs and versioned framework samples. Use awesome lists for ecosystem discovery and examples; do not let low-signal awesome entries override official guidance.",
};

export async function writeResearchIndex(): Promise<void> {
  await writeText(join(SOURCES_DIR, "inventory.json"), `${JSON.stringify(sourceInventory, null, 2)}\n`);
  console.log("wrote skills/nestjs-best-practices/sources/inventory.json");
}
