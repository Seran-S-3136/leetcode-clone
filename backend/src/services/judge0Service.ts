import axios, { AxiosError } from 'axios';
import { performance } from 'perf_hooks';
import { TestCase } from '../data/seedProblems';
import { ExecuteRequest, ExecuteResponse, TestResultItem } from './executionService';

export interface Judge0SubmissionInput {
  sourceCode: string;
  languageId: number;
  stdin?: string;
  expectedOutput?: string;
  cpuTimeLimit?: number;
  memoryLimit?: number;
}

export interface Judge0ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  execution_time: number | null;
  memory_usage: number | null;
  exit_code: number | null;
}

export interface Judge0Config {
  apiUrl?: string;
  apiKey?: string;
  apiHost?: string;
  maxRetries?: number;
  pollIntervalMs?: number;
}

/**
 * Judge0 CE Execution Service
 * Seamless, highly robust integration for sandboxed code execution & judging.
 */
export class Judge0Service {
  private static readonly DEFAULT_API_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
  private static readonly DEFAULT_API_KEY = process.env.JUDGE0_API_KEY || '';
  private static readonly DEFAULT_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

  // Comprehensive mapping from language name/slug to Judge0 CE Language IDs
  private static readonly LANGUAGE_MAP: Record<string, number> = {
    python: 71,       // Python (3.8.1)
    python3: 71,
    py: 71,
    javascript: 63,   // JavaScript (Node.js 12.14.0)
    js: 63,
    node: 63,
    typescript: 74,   // TypeScript (3.7.4)
    ts: 74,
    cpp: 54,          // C++ (GCC 9.2.0)
    'c++': 54,
    java: 62,         // Java (OpenJDK 13.0.1)
    c: 50,            // C (GCC 9.2.0)
    csharp: 51,       // C# (Mono 6.6.0.161)
    'c#': 51,
    ruby: 72,         // Ruby (2.7.0)
    rust: 73,         // Rust (1.40.0)
    go: 60,           // Go (1.13.5)
    golang: 60,
    php: 68,          // PHP (7.4.1)
    swift: 83,        // Swift (5.2.3)
    kotlin: 78,       // Kotlin (1.3.70)
  };

  /**
   * Resolves language name or ID to valid Judge0 CE languageId
   */
  public static getLanguageId(language: string | number): number {
    if (typeof language === 'number' && !isNaN(language) && language > 0) {
      return language;
    }
    const key = String(language).toLowerCase().trim();
    if (this.LANGUAGE_MAP[key]) {
      return this.LANGUAGE_MAP[key];
    }
    // Check if numeric string passed
    const parsedNumeric = parseInt(key, 10);
    if (!isNaN(parsedNumeric) && parsedNumeric > 0) {
      return parsedNumeric;
    }
    throw new Error(`Invalid language ID for Judge0 CE execution: "${language}". Supported languages include python, javascript, typescript, cpp, java, c, csharp, ruby, rust, go.`);
  }

  /**
   * Submits code to Judge0 CE and polls until terminal status is reached
   */
  public static async submitAndPoll(
    input: Judge0SubmissionInput,
    config: Judge0Config = {}
  ): Promise<Judge0ExecutionResult> {
    const apiUrl = config.apiUrl || this.DEFAULT_API_URL;
    const apiKey = config.apiKey !== undefined ? config.apiKey : this.DEFAULT_API_KEY;
    const apiHost = config.apiHost !== undefined ? config.apiHost : this.DEFAULT_API_HOST;
    const maxRetries = config.maxRetries || 25;
    const pollIntervalMs = config.pollIntervalMs || 1000;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey && (apiUrl.includes('rapidapi.com') || config.apiKey)) {
      headers['X-RapidAPI-Key'] = apiKey;
      headers['X-RapidAPI-Host'] = apiHost;
    }

    // Base64 encode inputs for safe transmission
    const encodeBase64 = (str: string | undefined): string | null => {
      if (str === undefined || str === null) return null;
      return Buffer.from(str, 'utf-8').toString('base64');
    };

    const decodeBase64 = (str: string | null | undefined): string | null => {
      if (!str) return null;
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch {
        return str;
      }
    };

    const payload = {
      source_code: encodeBase64(input.sourceCode),
      language_id: input.languageId,
      stdin: encodeBase64(input.stdin),
      expected_output: encodeBase64(input.expectedOutput),
      cpu_time_limit: input.cpuTimeLimit || 5,
      memory_limit: input.memoryLimit || 128000,
    };

    try {
      // 1. Submit Code
      const submitResponse = await axios.post(
        `${apiUrl}/submissions?base64_encoded=true&wait=false`,
        payload,
        { headers, timeout: 10000 }
      );

      const token = submitResponse.data?.token;
      if (!token) {
        throw new Error('Judge0 CE did not return a valid submission token.');
      }

      // 2. Poll until execution is complete (status id !== 1 [In Queue] and !== 2 [Processing])
      let attempts = 0;
      while (attempts < maxRetries) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

        const pollResponse = await axios.get(
          `${apiUrl}/submissions/${token}?base64_encoded=true`,
          { headers, timeout: 10000 }
        );

        const data = pollResponse.data;
        const statusId = data?.status?.id;

        if (statusId !== 1 && statusId !== 2) {
          // Terminal status reached
          return {
            stdout: decodeBase64(data.stdout),
            stderr: decodeBase64(data.stderr),
            compile_output: decodeBase64(data.compile_output),
            message: decodeBase64(data.message),
            status: {
              id: data.status.id,
              description: data.status.description || 'Unknown',
            },
            execution_time: data.time !== null && data.time !== undefined ? parseFloat(String(data.time)) : null,
            memory_usage: data.memory !== null && data.memory !== undefined ? parseInt(String(data.memory), 10) : null,
            exit_code: data.exit_code !== null && data.exit_code !== undefined ? parseInt(String(data.exit_code), 10) : null,
          };
        }
      }

      throw new Error('Judge0 CE execution timed out while polling for results.');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        const statusCode = axiosErr.response?.status;
        const errorData = axiosErr.response?.data;
        throw new Error(`Judge0 CE Network Error (${statusCode || 'Unknown'}): ${JSON.stringify(errorData || axiosErr.message)}`);
      }
      throw err;
    }
  }

  /**
   * Output Normalization Helper
   * Ignores trailing spaces, extra blank lines at the end, and platform-specific line endings (\r\n vs \n)
   */
  public static normalizeOutputForComparison(output: string): string {
    if (!output) return '';
    return output
      .replace(/\r\n/g, '\n')                   // Platform-specific line endings to \n
      .replace(/[ \t]+$/gm, '')                 // Trailing spaces on each line
      .replace(/\s*([\[\]\,\:\{\}])\s*/g, '$1') // Standardize array/object formatting (e.g., "[0, 1]" -> "[0,1]")
      .replace(/\n+$/, '')                      // Extra blank lines at the end
      .trim();
  }

  /**
   * Maps Judge0 CE status ID to compatible LeetCode verdicts
   */
  public static mapJudge0Verdict(
    statusId: number,
    actualOutput: string,
    expectedOutput: string
  ): ExecuteResponse['status'] {
    // 3 = Accepted (Check normalized output without whitespace differences)
    if (statusId === 3) {
      const normActual = this.normalizeOutputForComparison(actualOutput);
      const normExpected = this.normalizeOutputForComparison(expectedOutput);
      return normActual === normExpected ? 'Accepted' : 'Wrong Answer';
    }
    // 4 = Wrong Answer
    if (statusId === 4) return 'Wrong Answer';
    // 5 = Time Limit Exceeded
    if (statusId === 5) return 'Time Limit Exceeded';
    // 6 = Compilation Error
    if (statusId === 6) return 'Compilation Error';
    // 7-12 = Runtime Errors (SIGSEGV, SIGXFSZ, SIGFPE, SIGABRT, NZEC, Other)
    if (statusId >= 7 && statusId <= 12) return 'Runtime Error';
    // 13 = Internal Error / Memory Limit
    if (statusId === 13) return 'Internal Error';
    // 14 = Exec Format Error
    return 'Runtime Error';
  }

  /**
   * Prepares code wrapper / harness if needed so solution classes/functions execute properly with testcase inputs
   */
  private static prepareCodeWithHarness(code: string, language: string, problemId: string, tc: TestCase): string {
    const trimmed = code.trim();
    const lang = language.toLowerCase();

    // If code already defines main or does direct I/O, return as-is
    if (trimmed.includes('int main(') || trimmed.includes('void main(') || trimmed.includes('public static void main') || trimmed.includes('func main(') || trimmed.includes('fn main(') || trimmed.includes('sys.stdin')) {
      return code;
    }

    // C harness
    if (lang === 'c') {
      const cHeaders = trimmed.includes('#include') ? '' : '#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n#include <math.h>\n';
      const cDefs = `#ifndef DATA_STRUCTURES_DEFINED\n#define DATA_STRUCTURES_DEFINED\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\nstruct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n};\n#endif\n`;
      const cPrefix = `${cHeaders}${cDefs}`;
      if (problemId === 'two-sum' && trimmed.includes('twoSum')) {
        let numsStr = '2, 7, 11, 15';
        let numsLen = 4;
        let target = '9';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const parsedNums = lines[0].trim().split(/\s+/).filter(Boolean);
          if (parsedNums.length > 0) {
            numsStr = parsedNums.join(', ');
            numsLen = parsedNums.length;
          }
          if (lines[1]) target = lines[1].trim();
        }
        return `${cPrefix}${code}\nint main() {\n  int nums[] = {${numsStr}};\n  int returnSize = 0;\n  int* res = twoSum(nums, ${numsLen}, ${target}, &returnSize);\n  if (res && returnSize >= 2) {\n    printf("[%d, %d]\\n", res[0], res[1]);\n  } else {\n    printf("[]\\n");\n  }\n  return 0;\n}`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('addTwoNumbers')) {
        let l1Vals = '2, 4, 3'; let l1Len = 3;
        let l2Vals = '5, 6, 4'; let l2Len = 3;
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const p1 = lines[0] ? lines[0].trim().split(/\s+/).filter(Boolean) : [];
          const p2 = lines[1] ? lines[1].trim().split(/\s+/).filter(Boolean) : [];
          if (p1.length > 0) { l1Vals = p1.join(', '); l1Len = p1.length; }
          if (p2.length > 0) { l2Vals = p2.join(', '); l2Len = p2.length; }
        }
        return `${cPrefix}${code}\nstruct ListNode* buildList(int* arr, int size) {\n  struct ListNode dummy = {0, NULL};\n  struct ListNode* curr = &dummy;\n  for(int i=0; i<size; i++) {\n    curr->next = (struct ListNode*)malloc(sizeof(struct ListNode));\n    curr->next->val = arr[i];\n    curr->next->next = NULL;\n    curr = curr->next;\n  }\n  return dummy.next;\n}\nint main() {\n  int a[] = {${l1Vals}};\n  int b[] = {${l2Vals}};\n  struct ListNode* l1 = buildList(a, ${l1Len});\n  struct ListNode* l2 = buildList(b, ${l2Len});\n  struct ListNode* res = addTwoNumbers(l1, l2);\n  printf("[");\n  while(res) { printf("%d%s", res->val, res->next ? "," : ""); res = res->next; }\n  printf("]\\n");\n  return 0;\n}`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('isAnagram')) {
        let s = 'anagram';
        let t = 'nagaram';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) s = lines[0].trim();
          if (lines[1]) t = lines[1].trim();
        }
        return `${cPrefix}${code}\nint main() {\n  bool res = isAnagram("${s}", "${t}");\n  printf("%s\\n", res ? "true" : "false");\n  return 0;\n}`;
      }
      return `${cPrefix}${code}\nint main() {\n  printf("0\\n");\n  return 0;\n}`;
    }

    // C++ harness
    if (lang === 'cpp' || lang === 'c++') {
      const cppHeaders = trimmed.includes('#include') ? '' : '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <unordered_map>\n#include <set>\n#include <queue>\n#include <stack>\n#include <cmath>\nusing namespace std;\n';
      const cppDefs = `#ifndef DATA_STRUCTURES_DEFINED\n#define DATA_STRUCTURES_DEFINED\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n    ListNode(int x, ListNode *next) : val(x), next(next) {}\n};\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode() : val(0), left(nullptr), right(nullptr) {}\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};\n#endif\n`;
      const cppPrefix = `${cppHeaders}${cppDefs}`;
      if (problemId === 'two-sum' && trimmed.includes('twoSum')) {
        let numsStr = '2, 7, 11, 15';
        let target = '9';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const parsedNums = lines[0].trim().split(/\s+/).filter(Boolean);
          if (parsedNums.length > 0) numsStr = parsedNums.join(', ');
          if (lines[1]) target = lines[1].trim();
        }
        return `${cppPrefix}${code}\nint main() {\n  vector<int> nums = {${numsStr}};\n  Solution sol;\n  vector<int> res = sol.twoSum(nums, ${target});\n  if (res.size() >= 2) {\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n  } else {\n    cout << "[]" << endl;\n  }\n  return 0;\n}`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('addTwoNumbers')) {
        let l1Vals = '2, 4, 3';
        let l2Vals = '5, 6, 4';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const p1 = lines[0] ? lines[0].trim().split(/\s+/).filter(Boolean) : [];
          const p2 = lines[1] ? lines[1].trim().split(/\s+/).filter(Boolean) : [];
          if (p1.length > 0) l1Vals = p1.join(', ');
          if (p2.length > 0) l2Vals = p2.join(', ');
        }
        return `${cppPrefix}${code}\nListNode* buildList(const vector<int>& vals) {\n  ListNode dummy(0);\n  ListNode* curr = &dummy;\n  for(int x : vals) { curr->next = new ListNode(x); curr = curr->next; }\n  return dummy.next;\n}\nint main() {\n  vector<int> v1 = {${l1Vals}};\n  vector<int> v2 = {${l2Vals}};\n  Solution sol;\n  ListNode* res = sol.addTwoNumbers(buildList(v1), buildList(v2));\n  cout << "[";\n  while(res) { cout << res->val << (res->next ? "," : ""); res = res->next; }\n  cout << "]" << endl;\n  return 0;\n}`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('isAnagram')) {
        let s = 'anagram';
        let t = 'nagaram';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) s = lines[0].trim();
          if (lines[1]) t = lines[1].trim();
        }
        return `${cppPrefix}${code}\nint main() {\n  Solution sol;\n  bool res = sol.isAnagram("${s}", "${t}");\n  cout << (res ? "true" : "false") << endl;\n  return 0;\n}`;
      }
      return `${cppPrefix}${code}\nint main() {\n  Solution sol;\n  cout << "0" << endl;\n  return 0;\n}`;
    }

    // Python harness for Two Sum / Valid Anagram or general classes
    if (lang === 'python' || lang === 'python3' || lang === 'py') {
      const cleanCode = code.replace(/from __future__ import annotations\n?/g, '');
      const pyDefs = `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n`;
      const pyPrefix = `from __future__ import annotations\nimport sys, json, math, collections, itertools, functools, heapq, bisect, typing\nfrom typing import *\n${pyDefs}${cleanCode}`;
      if (problemId === 'two-sum' && trimmed.includes('twoSum')) {
        let inputPayload = tc && tc.input ? tc.input : '2 7 11 15\n9';
        return `${pyPrefix}\nimport json, sys\nlines = """${inputPayload.replace(/"/g, '\\"')}""".strip().split('\\n')\nif len(lines) >= 2:\n    nums = [int(x) for x in lines[0].split()]\n    target = int(lines[1])\n    sol = Solution() if 'Solution' in globals() else None\n    if sol:\n        res = sol.twoSum(nums, target)\n    else:\n        res = twoSum(nums, target)\n    print(json.dumps(res).replace(' ', ''))\nelse:\n    sol = Solution() if 'Solution' in globals() else None\n    res = sol.twoSum([2,7,11,15], 9) if sol else twoSum([2,7,11,15], 9)\n    print(json.dumps(res).replace(' ', ''))\n`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('addTwoNumbers')) {
        let inputPayload = tc && tc.input ? tc.input : '2 4 3\n5 6 4';
        return `${pyPrefix}\nimport json, sys\nlines = """${inputPayload.replace(/"/g, '\\"')}""".strip().split('\\n')\nl1_vals = [int(x) for x in lines[0].split()] if len(lines) > 0 and lines[0] else [2,4,3]\nl2_vals = [int(x) for x in lines[1].split()] if len(lines) > 1 and lines[1] else [5,6,4]\ndef build_list(vals):\n    dummy = ListNode(0)\n    curr = dummy\n    for v in vals:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return dummy.next\ndef list_to_vec(node):\n    res = []\n    while node:\n        res.append(node.val)\n        node = node.next\n    return res\nsol = Solution() if 'Solution' in globals() else None\nres_head = sol.addTwoNumbers(build_list(l1_vals), build_list(l2_vals)) if sol else addTwoNumbers(build_list(l1_vals), build_list(l2_vals))\nprint(json.dumps(list_to_vec(res_head)).replace(' ', ''))\n`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('isAnagram')) {
        let inputPayload = tc && tc.input ? tc.input : 'anagram\nnagaram';
        return `${pyPrefix}\nimport sys\nlines = """${inputPayload.replace(/"/g, '\\"')}""".strip().split('\\n')\nif len(lines) >= 2:\n    s = lines[0]\n    t = lines[1]\n    sol = Solution() if 'Solution' in globals() else None\n    if sol:\n        res = sol.isAnagram(s, t)\n    else:\n        res = isAnagram(s, t)\n    print('true' if res else 'false')\nelse:\n    sol = Solution() if 'Solution' in globals() else None\n    res = sol.isAnagram("anagram", "nagaram") if sol else isAnagram("anagram", "nagaram")\n    print('true' if res else 'false')\n`;
      }
      if (!trimmed.includes('print(')) {
        return `${pyPrefix}\n# Auto-invoking Solution\nif 'Solution' in globals():\n    pass\n`;
      }
      return pyPrefix;
    }

    // JavaScript / TypeScript harness
    if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts') {
      const jsDefs = `function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }\nfunction TreeNode(val, left, right) { this.val = (val===undefined ? 0 : val); this.left = (left===undefined ? null : left); this.right = (right===undefined ? null : right); }\n`;
      const jsCodeWithDefs = `${jsDefs}${code}`;
      if (problemId === 'two-sum' && trimmed.includes('twoSum')) {
        let numsStr = '2 7 11 15';
        let targetStr = '9';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) numsStr = lines[0].trim();
          if (lines[1]) targetStr = lines[1].trim();
        }
        return `${jsCodeWithDefs}\nconst nums = "${numsStr}".split(/\\s+/).filter(Boolean).map(Number);\nconst target = Number("${targetStr}");\nconst res = typeof twoSum === 'function' ? twoSum(nums, target) : new Solution().twoSum(nums, target);\nconsole.log(JSON.stringify(res));\n`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('addTwoNumbers')) {
        let l1Str = '2 4 3';
        let l2Str = '5 6 4';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) l1Str = lines[0].trim();
          if (lines[1]) l2Str = lines[1].trim();
        }
        return `${jsCodeWithDefs}\nconst v1 = "${l1Str}".split(/\\s+/).filter(Boolean).map(Number);\nconst v2 = "${l2Str}".split(/\\s+/).filter(Boolean).map(Number);\nfunction buildList(vals) { const d = new ListNode(0); let c = d; for(const x of vals) { c.next = new ListNode(x); c = c.next; } return d.next; }\nconst res = typeof addTwoNumbers === 'function' ? addTwoNumbers(buildList(v1), buildList(v2)) : new Solution().addTwoNumbers(buildList(v1), buildList(v2));\nconst out = []; let curr = res; while(curr) { out.push(curr.val); curr = curr.next; }\nconsole.log(JSON.stringify(out));\n`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('isAnagram')) {
        let s = 'anagram';
        let t = 'nagaram';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) s = lines[0].trim();
          if (lines[1]) t = lines[1].trim();
        }
        return `${jsCodeWithDefs}\nconst res = typeof isAnagram === 'function' ? isAnagram("${s}", "${t}") : new Solution().isAnagram("${s}", "${t}");\nconsole.log(res ? 'true' : 'false');\n`;
      }
      return jsCodeWithDefs;
    }

    // Java harness
    if (lang === 'java') {
      const javaHeaders = trimmed.includes('import java.util') ? '' : 'import java.util.*;\nimport java.io.*;\n';
      const javaDefs = trimmed.includes('class ListNode') ? '' : `class ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\nclass TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode() {}\n    TreeNode(int val) { this.val = val; }\n    TreeNode(int val, TreeNode left, TreeNode right) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n`;
      const javaPrefix = `${javaHeaders}${javaDefs}`;
      if (problemId === 'two-sum' && trimmed.includes('twoSum')) {
        let numsStr = '2, 7, 11, 15';
        let target = '9';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const parsedNums = lines[0].trim().split(/\s+/).filter(Boolean);
          if (parsedNums.length > 0) numsStr = parsedNums.join(', ');
          if (lines[1]) target = lines[1].trim();
        }
        return `${javaPrefix}${code}\nclass Main {\n  public static void main(String[] args) throws Exception {\n    int[] nums = new int[]{${numsStr}};\n    int target = ${target};\n    int[] res = new Solution().twoSum(nums, target);\n    if (res != null && res.length >= 2) {\n      System.out.println("[" + res[0] + "," + res[1] + "]");\n    } else {\n      System.out.println("[]");\n    }\n  }\n}`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('addTwoNumbers')) {
        let l1Vals = '2, 4, 3';
        let l2Vals = '5, 6, 4';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const p1 = lines[0] ? lines[0].trim().split(/\s+/).filter(Boolean) : [];
          const p2 = lines[1] ? lines[1].trim().split(/\s+/).filter(Boolean) : [];
          if (p1.length > 0) l1Vals = p1.join(', ');
          if (p2.length > 0) l2Vals = p2.join(', ');
        }
        return `${javaPrefix}${code}\nclass Main {\n  static ListNode buildList(int[] vals) {\n    ListNode dummy = new ListNode(0), curr = dummy;\n    for(int x : vals) { curr.next = new ListNode(x); curr = curr.next; }\n    return dummy.next;\n  }\n  public static void main(String[] args) throws Exception {\n    ListNode a = buildList(new int[]{${l1Vals}});\n    ListNode b = buildList(new int[]{${l2Vals}});\n    ListNode res = new Solution().addTwoNumbers(a, b);\n    StringBuilder sb = new StringBuilder("[");\n    while(res != null) { sb.append(res.val); if(res.next != null) sb.append(","); res = res.next; }\n    sb.append("]");\n    System.out.println(sb.toString());\n  }\n}`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('isAnagram')) {
        let s = 'anagram';
        let t = 'nagaram';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) s = lines[0].trim();
          if (lines[1]) t = lines[1].trim();
        }
        return `${javaPrefix}${code}\nclass Main {\n  public static void main(String[] args) throws Exception {\n    boolean res = new Solution().isAnagram("${s}", "${t}");\n    System.out.println(res ? "true" : "false");\n  }\n}`;
      }
      return `${javaPrefix}${code}\nclass Main {\n  public static void main(String[] args) throws Exception {\n    System.out.println("0");\n  }\n}`;
    }

    // Go harness
    if (lang === 'go' || lang === 'golang') {
      const pkgPrefix = trimmed.startsWith('package ') ? '' : 'package main\nimport "fmt"\n';
      const goDefs = `type ListNode struct {\n    Val  int\n    Next *ListNode\n}\ntype TreeNode struct {\n    Val   int\n    Left  *TreeNode\n    Right *TreeNode\n}\n`;
      const goPrefix = `${pkgPrefix}${goDefs}`;
      if (problemId === 'two-sum' && trimmed.includes('twoSum')) {
        let numsStr = '2, 7, 11, 15';
        let target = '9';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const parsedNums = lines[0].trim().split(/\s+/).filter(Boolean);
          if (parsedNums.length > 0) numsStr = parsedNums.join(', ');
          if (lines[1]) target = lines[1].trim();
        }
        return `${goPrefix}${code}\nfunc main() {\n  nums := []int{${numsStr}}\n  res := twoSum(nums, ${target})\n  if len(res) >= 2 {\n    fmt.Printf("[%d, %d]\\n", res[0], res[1])\n  } else {\n    fmt.Println("[]")\n  }\n}`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('addTwoNumbers')) {
        let l1Vals = '2, 4, 3';
        let l2Vals = '5, 6, 4';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const p1 = lines[0] ? lines[0].trim().split(/\s+/).filter(Boolean) : [];
          const p2 = lines[1] ? lines[1].trim().split(/\s+/).filter(Boolean) : [];
          if (p1.length > 0) l1Vals = p1.join(', ');
          if (p2.length > 0) l2Vals = p2.join(', ');
        }
        return `${goPrefix}${code}\nfunc buildList(vals []int) *ListNode {\n  dummy := &ListNode{Val: 0}\n  curr := dummy\n  for _, x := range vals {\n    curr.Next = &ListNode{Val: x}\n    curr = curr.Next\n  }\n  return dummy.Next\n}\nfunc main() {\n  a := buildList([]int{${l1Vals}})\n  b := buildList([]int{${l2Vals}})\n  res := addTwoNumbers(a, b)\n  fmt.Print("[")\n  for res != nil {\n    fmt.Print(res.Val)\n    if res.Next != nil { fmt.Print(",") }\n    res = res.Next\n  }\n  fmt.Println("]")\n}`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('isAnagram')) {
        let s = 'anagram';
        let t = 'nagaram';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) s = lines[0].trim();
          if (lines[1]) t = lines[1].trim();
        }
        return `${goPrefix}${code}\nfunc main() {\n  res := isAnagram("${s}", "${t}")\n  if res {\n    fmt.Println("true")\n  } else {\n    fmt.Println("false")\n  }\n}`;
      }
      return `${goPrefix}${code}\nfunc main() {\n  fmt.Println("0")\n}`;
    }

    // Rust harness
    if (lang === 'rust') {
      const structPrefix = trimmed.includes('struct Solution') ? '' : 'struct Solution;\n';
      const rustDefs = `#[derive(PartialEq, Eq, Clone, Debug)]\npub struct ListNode {\n  pub val: i32,\n  pub next: Option<Box<ListNode>>\n}\nimpl ListNode {\n  #[inline]\n  pub fn new(val: i32) -> Self {\n    ListNode { next: None, val }\n  }\n}\n#[derive(Debug, PartialEq, Eq)]\npub struct TreeNode {\n  pub val: i32,\n  pub left: Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>,\n  pub right: Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>,\n}\nimpl TreeNode {\n  #[inline]\n  pub fn new(val: i32) -> Self {\n    TreeNode { val, left: None, right: None }\n  }\n}\n`;
      const rustPrefix = `${structPrefix}${rustDefs}`;
      if (problemId === 'two-sum' && trimmed.includes('two_sum')) {
        let numsStr = '2, 7, 11, 15';
        let target = '9';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const parsedNums = lines[0].trim().split(/\s+/).filter(Boolean);
          if (parsedNums.length > 0) numsStr = parsedNums.join(', ');
          if (lines[1]) target = lines[1].trim();
        }
        return `${rustPrefix}${code}\nfn main() {\n  let nums = vec![${numsStr}];\n  let res = Solution::two_sum(nums, ${target});\n  if res.len() >= 2 {\n    println!("[{}, {}]", res[0], res[1]);\n  } else {\n    println!("[]");\n  }\n}`;
      }
      if (problemId === 'add-two-numbers' && trimmed.includes('add_two_numbers')) {
        let l1Vals = '2, 4, 3';
        let l2Vals = '5, 6, 4';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          const p1 = lines[0] ? lines[0].trim().split(/\s+/).filter(Boolean) : [];
          const p2 = lines[1] ? lines[1].trim().split(/\s+/).filter(Boolean) : [];
          if (p1.length > 0) l1Vals = p1.join(', ');
          if (p2.length > 0) l2Vals = p2.join(', ');
        }
        return `${rustPrefix}${code}\nfn build_list(vals: Vec<i32>) -> Option<Box<ListNode>> {\n  let mut head = None;\n  for &x in vals.iter().rev() {\n    let mut node = ListNode::new(x);\n    node.next = head;\n    head = Some(Box::new(node));\n  }\n  head\n}\nfn main() {\n  let a = build_list(vec![${l1Vals}]);\n  let b = build_list(vec![${l2Vals}]);\n  let mut res = Solution::add_two_numbers(a, b);\n  print!("[");\n  while let Some(node) = res {\n    print!("{}", node.val);\n    if node.next.is_some() { print!(","); }\n    res = node.next;\n  }\n  println!("]");\n}`;
      }
      if (problemId === 'valid-anagram' && trimmed.includes('is_anagram')) {
        let s = 'anagram';
        let t = 'nagaram';
        if (tc && tc.input) {
          const lines = tc.input.split('\n');
          if (lines[0]) s = lines[0].trim();
          if (lines[1]) t = lines[1].trim();
        }
        return `${rustPrefix}${code}\nfn main() {\n  let res = Solution::is_anagram("${s}".to_string(), "${t}".to_string());\n  println!("{}", if res { "true" } else { "false" });\n}`;
      }
      return `${rustPrefix}${code}\nfn main() {\n  println!("0");\n}`;
    }

    return code;
  }

  /**
   * Evaluates code against multiple test cases using Judge0 CE.
   * Supports both Run Code and Submit Solution workflows.
   * Stops execution on the first failed test case.
   */
  public static async evaluateProblem(
    req: ExecuteRequest,
    testCases: TestCase[]
  ): Promise<ExecuteResponse> {
    const startTimestamp = performance.now();
    const languageId = this.getLanguageId(req.language);

    const testCasesToRun = req.mode === 'run'
      ? testCases.filter((tc) => !tc.isHidden)
      : testCases;

    if (!testCasesToRun || testCasesToRun.length === 0) {
      throw new Error('No test cases available for evaluation.');
    }

    const testResults: TestResultItem[] = [];
    let passedCount = 0;
    let firstFailure: { input: string; expected: string; actual: string } | undefined;
    let firstFailedIndex: number | undefined;
    let totalRuntimeMs = 0;
    let maxMemoryMB = 0;
    let overallVerdict: ExecuteResponse['status'] = 'Accepted';
    let compilationOutputMsg = 'Compiled successfully.';
    let consoleOutputMsg = '';
    let lastStdout = '';
    let lastStderr = '';
    let lastExitCode: number | undefined;
    let lastJudge0StatusId = 3;

    for (let idx = 0; idx < testCasesToRun.length; idx++) {
      const tc = testCasesToRun[idx];
      const sourceWithHarness = this.prepareCodeWithHarness(req.code, req.language, req.problemId, tc);

      const submissionInput: Judge0SubmissionInput = {
        sourceCode: sourceWithHarness,
        languageId,
        stdin: tc.input,
        cpuTimeLimit: 5,
        memoryLimit: 128000,
      };

      const result = await this.submitAndPoll(submissionInput);
      lastStdout = result.stdout || '';
      lastStderr = result.stderr || '';
      lastExitCode = result.exit_code !== null ? result.exit_code : undefined;
      lastJudge0StatusId = result.status?.id || 3;

      // Handle Compilation Error
      if (result.status.id === 6) {
        const compileErr = (result.compile_output || result.stderr || result.message || 'Compilation Error').trim();
        return {
          status: 'Compilation Error',
          verdict: 'Compilation Error',
          runtimeMs: 1,
          memoryMB: 12.0,
          passedCount: 0,
          totalCount: testCasesToRun.length,
          compilationOutput: compileErr,
          compile_output: compileErr,
          consoleOutput: `Compilation Error: ${compileErr}`,
          stdout: '',
          stderr: compileErr,
          exitCode: result.exit_code || 1,
          exit_code: result.exit_code || 1,
          executionStatus: 'Compilation Error',
          execution_status: 'Compilation Error',
          judge0StatusId: 6,
          judge0_status_id: 6,
          testResults: [],
        };
      }

      // Collect metrics
      const tcRuntimeMs = result.execution_time !== null && result.execution_time !== undefined
        ? Math.round(result.execution_time * 1000)
        : Math.max(1, Math.round(performance.now() - startTimestamp));
      totalRuntimeMs += tcRuntimeMs;

      const tcMemoryMB = result.memory_usage !== null && result.memory_usage !== undefined
        ? Number((result.memory_usage / 1024).toFixed(1))
        : 14.5;
      if (tcMemoryMB > maxMemoryMB) maxMemoryMB = tcMemoryMB;

      const actualOutput = (result.stdout || result.stderr || result.message || '').trim();
      const expectedOutput = tc.expectedOutput.trim();

      const verdict = this.mapJudge0Verdict(result.status.id, actualOutput, expectedOutput);
      const passed = verdict === 'Accepted';

      if (passed) {
        passedCount++;
      } else {
        overallVerdict = verdict;
        if (!firstFailure) {
          firstFailure = {
            input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
            expected: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
            actual: tc.isHidden ? '[Hidden]' : (actualOutput || `[${result.status.description}]`),
          };
          firstFailedIndex = idx;
        }
      }

      testResults.push({
        id: tc.id,
        input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: tc.isHidden ? '[Hidden]' : (actualOutput || `[${result.status.description}]`),
        passed,
        isHidden: tc.isHidden,
      });

      // Stop execution on the first failed test case according to requirements
      if (!passed && req.mode === 'submit') {
        if (verdict === 'Compilation Error') {
          compilationOutputMsg = actualOutput || result.compile_output || 'Compilation failed.';
        }
        consoleOutputMsg = `${verdict}: Output mismatch on testcase or runtime exception (${result.status.description}).`;
        break;
      }
    }

    if (passedCount === testCasesToRun.length && overallVerdict === 'Accepted') {
      consoleOutputMsg = `All ${testCasesToRun.length} test cases passed successfully via Judge0 CE.`;
    } else if (req.mode === 'run' && overallVerdict !== 'Accepted') {
      consoleOutputMsg = `${overallVerdict}: One or more testcases failed.`;
    }

    const finalRuntimeMs = Math.max(2, Math.round(totalRuntimeMs || (performance.now() - startTimestamp)));
    const finalMemoryMB = maxMemoryMB > 0 ? maxMemoryMB : 15.2;

    return {
      status: overallVerdict,
      verdict: overallVerdict,
      runtimeMs: finalRuntimeMs,
      runtime: finalRuntimeMs,
      memoryMB: finalMemoryMB,
      memory: finalMemoryMB,
      passedCount,
      passed_test_cases: passedCount,
      totalCount: testCasesToRun.length,
      total_test_cases: testCasesToRun.length,
      compilationOutput: compilationOutputMsg,
      compile_output: compilationOutputMsg,
      consoleOutput: consoleOutputMsg,
      stdout: lastStdout,
      stderr: lastStderr,
      exitCode: lastExitCode !== undefined ? lastExitCode : (overallVerdict === 'Accepted' ? 0 : 1),
      exit_code: lastExitCode !== undefined ? lastExitCode : (overallVerdict === 'Accepted' ? 0 : 1),
      executionStatus: overallVerdict,
      execution_status: overallVerdict,
      judge0StatusId: lastJudge0StatusId,
      judge0_status_id: lastJudge0StatusId,
      testResults,
      test_results: testResults,
      failedTestCase: firstFailure,
      first_failed_test_case: firstFailure,
      firstFailedTestCaseIndex: firstFailedIndex,
      first_failed_test_case_index: firstFailedIndex,
    };
  }
}
