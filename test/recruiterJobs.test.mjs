import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the create job payload with only the POST /api/jobs edit-value fields", async () => {
  const source = await readFile(new URL("../src/pages/jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /headcount: flat\.headcount \?\? 0/);
  assert.match(source, /locations: normalizeLocations\(flat\.location\)/);
  assert.match(source, /const normalizedRequiredSkills = normalizeSkillNames\(flat\.requiredSkills\)/);
  assert.match(source, /requiredSkills: normalizedRequiredSkills/);
  assert.match(source, /preferredSkills: normalizedPreferredSkills\.length \? normalizedPreferredSkills : normalizedRequiredSkills/);
  assert.match(source, /minGpa: flat\.minGpa \?\? 0/);
  assert.match(source, /requiredLanguages: normalizedRequiredLanguages\.length \? normalizedRequiredLanguages : \["Không yêu cầu"\]/);
  assert.match(source, /portfolioExpected: normalizeOptionalText\(flat\.portfolioExpected, "Không yêu cầu"\)/);
  assert.doesNotMatch(source, /headCount: flat\.headcount/);
  assert.doesNotMatch(source, /salary: flat\.salary/);
  assert.doesNotMatch(source, /client: flat\.client/);
  assert.doesNotMatch(source, /shortDescription: flat\.shortDescription/);
  assert.doesNotMatch(source, /location: flat\.location/);
});

test("create job flow publishes the created job after POST /api/jobs", async () => {
  const source = await readFile(new URL("../src/pages/jobs/Index.tsx", import.meta.url), "utf8");
  const createFlow = source.slice(source.indexOf("const handleCreateJob"), source.indexOf("const handleUpdateJob"));

  assert.match(createFlow, /fetch\("\/api\/jobs"/);
  assert.match(createFlow, /method: "POST"/);
  assert.doesNotMatch(createFlow, /API_BASE_URL/);
  assert.match(createFlow, /extractCreatedJobId\(createPayload\)/);
  assert.match(createFlow, /fetch\(`\/api\/jobs\/\$\{encodeURIComponent\(createdJobId\)\}\/publish`/);
  assert.match(createFlow, /method: "PATCH"/);
});

test("created job id extraction supports nested API response shapes", async () => {
  const source = await readFile(new URL("../src/pages/jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /const getStringId = \(value: unknown\): string =>/);
  assert.match(source, /const extractCreatedJobId = \(payload: unknown\): string =>/);
  assert.match(source, /objectPayload\.data/);
  assert.match(source, /objectPayload\._id/);
  assert.match(source, /objectPayload\.id/);
  assert.match(source, /objectPayload\.jobId/);
});

test("recruiter jobs API calls use the Vite /api proxy path", async () => {
  const source = await readFile(new URL("../src/pages/jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /fetch\("\/api\/jobs"/);
  assert.match(source, /fetch\(`\/api\/jobs\/\$\{encodeURIComponent\(id\)\}`/);
  assert.match(source, /fetch\(`\/api\/jobs\/\$\{encodeURIComponent\(id\)\}\/close`/);
  assert.doesNotMatch(source, /\$\{API_BASE_URL\}\/api\/jobs/);
});

test("normalizes API headCount and minMonthsExperience values for rendering", async () => {
  const source = await readFile(new URL("../src/pages/jobs/Index.tsx", import.meta.url), "utf8");

  assert.match(source, /basicInfo\?\.headCount/);
  assert.match(source, /requirements\?\.minMonthsExperience/);
  assert.match(source, /requirements\?\.requiredSkills/);
});

test("job create and update forms expose required edit-value fields", async () => {
  const createSource = await readFile(new URL("../src/pages/jobs/components/CreateJobModal.tsx", import.meta.url), "utf8");
  const updateSource = await readFile(new URL("../src/pages/jobs/components/UpdateJobModal.tsx", import.meta.url), "utf8");

  for (const source of [createSource, updateSource]) {
    assert.match(source, /name="requiredSkillsText"/);
    assert.match(source, /name="preferredSkillsText"/);
    assert.match(source, /name="requiredLanguagesText"/);
    assert.match(source, /name="minGpa"/);
    assert.match(source, /name="portfolioExpected"/);
    assert.match(source, /parsedRequiredSkills\.length/);
    assert.doesNotMatch(source, /parsedPreferredSkills\.length/);
    assert.doesNotMatch(source, /parsedRequiredLanguages\.length/);
    assert.doesNotMatch(source, /portfolioExpected\?\.(trim|length)/);
  }
});

test("job forms submit backend-compatible select values", async () => {
  const createSource = await readFile(new URL("../src/pages/jobs/components/CreateJobModal.tsx", import.meta.url), "utf8");
  const updateSource = await readFile(new URL("../src/pages/jobs/components/UpdateJobModal.tsx", import.meta.url), "utf8");

  for (const source of [createSource, updateSource]) {
    assert.match(source, /value: "Remote"/);
    assert.match(source, /value: "On-site"/);
    assert.match(source, /value: "Fresher"/);
    assert.match(source, /value: "Part-time"/);
    assert.match(source, /value: "Design"/);
    assert.doesNotMatch(source, /value: "remote"/);
    assert.doesNotMatch(source, /value: "parttime"/);
    assert.doesNotMatch(source, /value: "design"/);
  }
});
