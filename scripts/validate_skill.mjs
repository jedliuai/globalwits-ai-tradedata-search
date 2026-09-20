#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "README.md",
  "SKILL.md",
  "agents/openai.yaml",
  "references/user-checkpoints.md",
  "references/workflow.md",
  "references/screening-rules.md",
  "references/field-map.md",
  "scripts/filter_and_price.mjs",
  "tests/filter_and_price.test.mjs",
];

const errors = [];

async function exists(relativePath) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

for (const relativePath of requiredFiles) {
  if (!(await exists(relativePath))) errors.push(`Missing required file: ${relativePath}`);
}

const skill = await fs.readFile(path.join(root, "SKILL.md"), "utf8");
const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!frontmatter) {
  errors.push("SKILL.md must start with YAML frontmatter");
} else {
  if (!/^name:\s*globalwits-ai-tradedata-search\s*$/m.test(frontmatter[1])) {
    errors.push("SKILL.md name must be globalwits-ai-tradedata-search");
  }
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!description) errors.push("SKILL.md must include a description");
  if (description && description.length > 1024) errors.push("SKILL.md description must be 1024 characters or fewer");
}

const manifest = await fs.readFile(path.join(root, "agents/openai.yaml"), "utf8");
for (const field of ["display_name:", "short_description:", "default_prompt:", "allow_implicit_invocation:"]) {
  if (!manifest.includes(field)) errors.push(`agents/openai.yaml is missing ${field}`);
}

async function validateRelativeLinks(relativeDocument) {
  const documentPath = path.join(root, relativeDocument);
  const source = await fs.readFile(documentPath, "utf8");
  const links = [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
  for (const href of links) {
    if (/^(?:https?:|mailto:|#)/i.test(href)) continue;
    const clean = decodeURIComponent(href.split("#", 1)[0]);
    const target = path.resolve(path.dirname(documentPath), clean);
    if (!target.startsWith(root + path.sep) && target !== root) {
      errors.push(`${relativeDocument} links outside the repository: ${href}`);
    } else if (!(await exists(path.relative(root, target)))) {
      errors.push(`${relativeDocument} has a broken relative link: ${href}`);
    }
  }
}

for (const document of ["README.md", "SKILL.md", "docs/GETTING_STARTED.md", "docs/MAINTENANCE.md"]) {
  await validateRelativeLinks(document);
}

if (/--browser\s+chrome\b/i.test(await fs.readFile(path.join(root, "references/workflow.md"), "utf8"))) {
  errors.push("references/workflow.md must not launch Chrome on this machine");
}

if (errors.length) {
  process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`Validated ${requiredFiles.length} required files and documentation links.\n`);
