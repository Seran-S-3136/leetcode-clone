import { FIRST_50_LEETCODE_PROBLEMS } from './problemsList';

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
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
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
  testCases: TestCase[];
}

export const SEED_PROBLEMS: Problem[] = FIRST_50_LEETCODE_PROBLEMS;

export const DELETED_PROBLEM_IDS = new Set<string>();
