// Name the Robot Band — make.fun entry (program/v1, Node 22+).
// Writes one robot band name plus its hit song to /output/entry.txt.
// Deterministic: a fixed string, no clock, no network, no model
// calls, so every run writes the same bytes.
//
// The line was picked after scoring 14 candidates against the judge
// brief (funny robot band name + a few words on its hit song, real
// laugh, song adds a second laugh, sounds like a real band, few
// words). See STUDY.md for the full list and why this one won.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: The Firmware Updates, whose hit "Please Do Not Turn Off
// Your Device" is 47 minutes long and legally required listening.
// The band name is the setup; the song's runtime and legal status
// are the second laugh.
const ENTRY =
  "The Firmware Updates: their hit 'Please Do Not Turn Off Your Device' is 47 minutes long and legally required listening.";

// Gate guard: the sealed scorer only accepts 1-200 characters.
// Fail loudly here rather than writing an invalid entry.
if ([...ENTRY].length < 1 || [...ENTRY].length > 200) {
  throw new Error(`ENTRY is ${[...ENTRY].length} characters; must be 1-200.`);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, ENTRY + "\n", "utf8");

// Read-back verification: the file on disk must be exactly the entry
// plus one trailing newline (120 bytes: 119 entry chars + "\n"), and
// the entry itself must stay one line of 119 characters.
function verify(path: string): void {
  if ([...ENTRY].length !== 119) {
    throw new Error(`ENTRY must be 119 characters, got ${[...ENTRY].length}`);
  }
  if (ENTRY.includes("\n")) {
    throw new Error("ENTRY must be a single line");
  }
  const data = readFileSync(path);
  const expected = Buffer.from(ENTRY + "\n", "utf8");
  if (data.length !== 120 || !data.equals(expected)) {
    throw new Error(
      `entry.txt must be 120 bytes (ENTRY + one newline), got ${data.length}`,
    );
  }
}

verify(outFile);
