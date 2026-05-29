import { spawn } from "node:child_process";

const SITE_URL = process.env.SITE_URL || "https://maisontanneurs.com";

type Gate = {
  name: string;
  command: string;
  args: string[];
};

const GATES: Gate[] = [
  {
    name: "Public routes/content",
    command: "pnpm",
    args: ["audit:public"],
  },
  {
    name: "Public internal/external links",
    command: "pnpm",
    args: ["audit:links"],
  },
  {
    name: "Product media",
    command: "pnpm",
    args: ["exec", "tsx", "scripts/audit-assets.ts"],
  },
  {
    name: "Product source inventory",
    command: "pnpm",
    args: ["audit:sources"],
  },
];

function runGate(gate: Gate) {
  return new Promise<number>((resolve) => {
    const child = spawn(gate.command, gate.args, {
      stdio: "inherit",
      env: {
        ...process.env,
        SITE_URL,
      },
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

async function main() {
  console.log("=== Maison Tanneurs launch readiness audit ===");
  console.log(`Site: ${SITE_URL}`);
  console.log("");

  const failures: string[] = [];

  for (const gate of GATES) {
    console.log(`\n--- ${gate.name} ---`);
    const code = await runGate(gate);
    if (code !== 0) failures.push(gate.name);
  }

  console.log("\n=== Remaining known non-blocking launch gaps ===");
  console.log("- Launch scope is bags and small leather goods only; no clothes/jackets.");
  console.log("- No HF generation required for the current launch set.");

  if (failures.length > 0) {
    console.error("\n=== Launch readiness audit failed ===");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("\n=== Launch readiness audit passed ===");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
