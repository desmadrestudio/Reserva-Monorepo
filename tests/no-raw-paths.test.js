import assert from 'node:assert/strict';
import test from 'node:test';
import { execSync } from 'node:child_process';

function grep(pattern) {
  try {
    return execSync(pattern, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

test('no raw absolute paths', () => {
  const linkMatches = grep("grep -R \"to=\\\"/\" app | grep -v getAppUrl");
  const urlMatches = grep("grep -R \"url=\\\"/\" app | grep -v getAppUrl");
  const navMatches = grep("grep -R \"navigate(\\\"/\" app | grep -v getAppUrl");
  const combined = [linkMatches, urlMatches, navMatches].filter(Boolean).join('\n');
  assert.equal(combined, '', `Found raw absolute paths:\n${combined}`);
});
