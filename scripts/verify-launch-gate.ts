import { spawn } from "node:child_process";

const checks = [
  ["pnpm", ["-s", "exec", "tsc", "--noEmit"]],
  ["pnpm", ["-s", "build"]],
  ["pnpm", ["-s", "verify:success-capi"]],
  ["pnpm", ["-s", "verify:live-feed"]],
  ["pnpm", ["-s", "verify:live-meta"]],
  ["pnpm", ["-s", "verify:live-checkout"]],
] as const;

function run(command: string, args: readonly string[]) {
  return new Promise<void>((resolve, reject) => {
    console.log(`\n$ ${[command, ...args].join(" ")}`);
    const child = spawn(command, [...args], {
      env: process.env,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function main() {
  for (const [command, args] of checks) {
    await run(command, args);
  }

  console.log("\nLaunch gate verification passed");
  console.log("Traffic is still not approved until billing, real Purchase, and dedup are verified.");
}

main().catch((err) => {
  console.error("\nLaunch gate verification failed");
  console.error(err);
  process.exit(1);
});
