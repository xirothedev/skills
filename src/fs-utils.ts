import { mkdir, readdir, readFile, stat, writeFile, copyFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

export type FileEntry = {
  path: string;
  relativePath: string;
};

export async function readText(path: string): Promise<string> {
  return await readFile(path, "utf8");
}

export async function writeText(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

export async function copyFileEnsuringDir(source: string, target: string): Promise<void> {
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}

export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function listFiles(root: string, suffix?: string): Promise<FileEntry[]> {
  const out: FileEntry[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (!suffix || full.endsWith(suffix)) {
        out.push({ path: full, relativePath: relative(root, full) });
      }
    }
  }

  await walk(root);
  return out.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

export function parseFrontmatter(content: string): Record<string, string> {
  if (!content.startsWith("---\n")) return {};
  const end = content.indexOf("\n---", 4);
  if (end === -1) return {};
  const raw = content.slice(4, end).trim();
  const data: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return data;
}
