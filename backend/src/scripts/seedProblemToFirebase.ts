import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.error('No serviceAccountKey.json found!');
  process.exit(1);
}

const db = admin.firestore();

async function seedNewProblem() {
  const sampleProblem = {
    id: 'valid-anagram',
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
      'Time Limit: 1.0 seconds'
    ],
    inputFormat: 'Two strings s and t provided as arguments.',
    outputFormat: 'Boolean true if anagram, false otherwise.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Rearranging letters of "anagram" yields "nagaram".'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
        explanation: 'Different characters are present.'
      }
    ],
    tags: ['Hash Table', 'String', 'Sorting'],
    companyTags: ['Google', 'Amazon', 'Meta'],
    timeLimitMs: 1000,
    memoryLimitMB: 64,
    starterCode: {
      python: 'class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass\n',
      javascript: 'var isAnagram = function(s, t) {\n    \n};\n',
      typescript: 'function isAnagram(s: string, t: string): boolean {\n    \n}\n'
    },
    correctSolution: {
      python: 'class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        return sorted(s) == sorted(t)\n'
    },
    status: 'published',
    acceptanceRate: 64.2,
    totalSubmissions: 4200,
    totalAccepted: 2700,
    testCases: [
      { id: 'tc-1', input: 's = "anagram", t = "nagaram"', expectedOutput: 'true', isHidden: false },
      { id: 'tc-2', input: 's = "rat", t = "car"', expectedOutput: 'false', isHidden: false },
      { id: 'tc-3', input: 's = "a", t = "ab"', expectedOutput: 'false', isHidden: true }
    ],
    createdAt: new Date().toISOString()
  };

  await db.collection('problems').doc(sampleProblem.slug).set(sampleProblem, { merge: true });
  console.log(`✅ Successfully added problem "${sampleProblem.title}" into Firebase Firestore (collection: "problems", document ID: "${sampleProblem.slug}")!`);
  process.exit(0);
}

seedNewProblem().catch((err) => {
  console.error('Failed to seed problem:', err);
  process.exit(1);
});
