import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { normalizeCandidateApplication } from "../src/pages/candidate_jobs/candidateApplications.ts";

test("uses the job companyId as the company description lookup key", () => {
  const application = normalizeCandidateApplication({
    _id: "application-1",
    companyId: "application-company",
    job: {
      _id: "job-1",
      title: "Frontend Developer",
      companyId: "job-company",
    },
  });

  assert.equal(application.companyId, "job-company");
});

test("fetches company descriptions from the companies collection endpoint", async () => {
  const source = await readFile(new URL("../src/pages/candidate_jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /\/api\/companies\/\?companyId=/);
  assert.doesNotMatch(source, /\/api\/companies\/me\?companyId=/);
});

test("resolves company descriptions after mapping jobs to their creator company", async () => {
  const source = await readFile(new URL("../src/pages/candidate_jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /buildJobCompanyIdMap/);
  assert.match(source, /const resolvedApplications = applications\.map/);
  assert.match(source, /jobCompanyIds\.get\(application\.jobId\) \|\| application\.companyId/);
  assert.match(source, /resolvedApplications\.map\(\(application\) => application\.companyId\)/);
});

test("matches company endpoint descriptions by the requested company id", async () => {
  const source = await readFile(new URL("../src/pages/candidate_jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /extractCompanyDescription\(payload, companyId\)/);
  assert.match(source, /recordMatchesCompanyId/);
});
