export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
  examples: Example[];
  tags: string[];
  companyTags: string[];
  timeLimitMs: number;
  memoryLimitMB: number;
  starterCode: Record<string, string>;
  correctSolution: Record<string, string>;
  editorial?: string;
  status: 'published' | 'draft';
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;
  testCases?: TestCase[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  solvedCount: {
    easy: number;
    medium: number;
    hard: number;
  };
  streak: number;
  acceptanceRate: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  problemTitle: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Time Limit Exceeded';
  runtimeMs: number;
  memoryMB: number;
  passedCount: number;
  totalCount: number;
  failedTestCase?: {
    input: string;
    expected: string;
    actual: string;
  };
  createdAt: string;
}
