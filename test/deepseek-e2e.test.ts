import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
const evalsEnabled = !!process.env.EVALS;
const hasApiKey = !!process.env.DEEPSEEK_API_KEY;
const SKIP = !hasApiKey || !evalsEnabled;
const describeDeepseek = SKIP ? describe.skip : describe;

if (!evalsEnabled) {
  // EVALS=1 required like other e2e tests.
} else if (!hasApiKey) {
  process.stderr.write('\nDeepseek E2E: SKIPPED — DEEPSEEK_API_KEY not set\n');
}

describeDeepseek('Deepseek E2E', () => {
  test('deepseek skill file exists and mentions API configuration', () => {
    const deepseekSkill = fs.readFileSync(path.join(ROOT, 'deepseek/SKILL.md'), 'utf8');
    expect(deepseekSkill).toContain('/deepseek');
    expect(deepseekSkill).toContain('DEEPSEEK_API_KEY');
    expect(deepseekSkill).toContain('https://api.deepseek.com');
  });
});
