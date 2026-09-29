/**
 * scripts/verify.ts
 *
 * Master verification script for the Sortes project.
 * Run with: npx tsx scripts/verify.ts
 * Or via:   npm run verify
 *
 * Checks:
 * 1. TypeScript typecheck (tsc --noEmit)
 * 2. ESLint
 * 3. Next.js build
 * 4. Forbidden-term grep (the portfolio domain name)
 * 5. Git author check (must not contain the forbidden term)
 * 6. Secrets grep (no .env.local values in tracked files)
 * 7. Phase-specific checks (extensible)
 */

import { execSync } from "child_process";
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = join(__dirname, "..");
const FORBIDDEN_TERM = "drvelu";

// Files/dirs excluded from the forbidden-term grep
const EXCLUDED_PATHS = [
  "CLAUDE.md",
  "PHASES.md",
  "scripts/verify.ts",
  "node_modules",
  ".next",
  ".git",
  "package-lock.json",
  ".tools",
];

let failed = false;
const results: { check: string; status: "PASS" | "FAIL"; detail?: string }[] =
  [];

function run(label: string, cmd: string): boolean {
  process.stdout.write(`\n🔍 ${label}... `);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "pipe", timeout: 120_000 });
    console.log("✅ PASS");
    results.push({ check: label, status: "PASS" });
    return true;
  } catch (err) {
    const msg =
      err instanceof Error
        ? (err as { stderr?: Buffer }).stderr?.toString().slice(0, 500) ||
          err.message
        : String(err);
    console.log("❌ FAIL");
    results.push({ check: label, status: "FAIL", detail: msg });
    failed = true;
    return false;
  }
}

/**
 * Recursively collect all files, skipping excluded paths.
 */
function collectFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full).replace(/\\/g, "/");

    if (EXCLUDED_PATHS.some((ex) => rel === ex || rel.startsWith(ex + "/"))) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...collectFiles(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function checkForbiddenTerm(): void {
  process.stdout.write(`\n🔍 Forbidden term grep... `);
  const files = collectFiles(ROOT);
  const hits: string[] = [];

  for (const file of files) {
    try {
      const stat = statSync(file);
      // Skip binary files (rough heuristic: > 1MB or known extensions)
      if (
        stat.size > 1_000_000 ||
        /\.(jpg|jpeg|png|gif|webp|ico|woff|woff2|ttf|eot|svg|mp4|webm)$/i.test(
          file,
        )
      ) {
        continue;
      }
      const content = readFileSync(file, "utf-8");
      if (content.toLowerCase().includes(FORBIDDEN_TERM)) {
        hits.push(relative(ROOT, file));
      }
    } catch {
      // Skip files we can't read
    }
  }

  if (hits.length > 0) {
    console.log("❌ FAIL");
    results.push({
      check: "Forbidden term grep",
      status: "FAIL",
      detail: `Found "${FORBIDDEN_TERM}" in: ${hits.join(", ")}`,
    });
    failed = true;
  } else {
    console.log("✅ PASS");
    results.push({ check: "Forbidden term grep", status: "PASS" });
  }
}

function checkGitAuthor(): void {
  process.stdout.write(`\n🔍 Git author check... `);
  try {
    const name = execSync("git config user.name", {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();
    const email = execSync("git config user.email", {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();
    const combined = `${name} ${email}`.toLowerCase();

    if (combined.includes(FORBIDDEN_TERM)) {
      console.log("❌ FAIL");
      results.push({
        check: "Git author check",
        status: "FAIL",
        detail: `Git identity contains forbidden term: ${name} <${email}>`,
      });
      failed = true;
    } else {
      console.log("✅ PASS");
      results.push({ check: "Git author check", status: "PASS" });
    }
  } catch {
    console.log("⚠️  SKIP (no git config)");
    results.push({
      check: "Git author check",
      status: "PASS",
      detail: "Skipped: no git config found",
    });
  }
}

function checkSecretsNotCommitted(): void {
  process.stdout.write(`\n🔍 Secrets grep... `);
  try {
    // Check if .env.local exists and has actual values
    const envLocal = readFileSync(join(ROOT, ".env.local"), "utf-8");
    const secrets = envLocal
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        return (
          trimmed && !trimmed.startsWith("#") && trimmed.includes("=")
        );
      })
      .map((line) => line.split("=").slice(1).join("=").trim())
      .filter((val) => val.length > 10); // Only check substantial values

    if (secrets.length === 0) {
      console.log("✅ PASS (no secrets to check)");
      results.push({
        check: "Secrets grep",
        status: "PASS",
        detail: "No substantial secrets found in .env.local",
      });
      return;
    }

    // Check tracked files for any secrets
    const files = collectFiles(ROOT);
    const hits: string[] = [];

    for (const file of files) {
      if (file.endsWith(".env.local")) continue;
      try {
        const content = readFileSync(file, "utf-8");
        for (const secret of secrets) {
          if (content.includes(secret)) {
            hits.push(relative(ROOT, file));
            break;
          }
        }
      } catch {
        // Skip
      }
    }

    if (hits.length > 0) {
      console.log("❌ FAIL");
      results.push({
        check: "Secrets grep",
        status: "FAIL",
        detail: `Secrets found in: ${hits.join(", ")}`,
      });
      failed = true;
    } else {
      console.log("✅ PASS");
      results.push({ check: "Secrets grep", status: "PASS" });
    }
  } catch {
    console.log("✅ PASS (no .env.local)");
    results.push({
      check: "Secrets grep",
      status: "PASS",
      detail: "No .env.local found",
    });
  }
}

// --- Main ---
console.log("═══════════════════════════════════════");
console.log("  Sortes Verification Script");
console.log("═══════════════════════════════════════");

// 1. TypeScript
run("TypeScript typecheck", "npx tsc --noEmit");

// 2. ESLint (Next.js 16 removed `next lint`; run eslint directly)
run("ESLint", "npx eslint src");

// 3. Build
run("Next.js build", "npx next build");

// 4. Forbidden term
checkForbiddenTerm();

// 5. Git author
checkGitAuthor();

// 6. Secrets
checkSecretsNotCommitted();

// Summary
console.log("\n═══════════════════════════════════════");
console.log("  Summary");
console.log("═══════════════════════════════════════");
for (const r of results) {
  const icon = r.status === "PASS" ? "✅" : "❌";
  console.log(`  ${icon} ${r.check}`);
  if (r.detail && r.status === "FAIL") {
    console.log(`     ${r.detail.slice(0, 200)}`);
  }
}

if (failed) {
  console.log("\n❌ Verification FAILED");
  process.exit(1);
} else {
  console.log("\n✅ All checks passed");
  process.exit(0);
}
