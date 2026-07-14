import { Problem } from './types';

export const FIRST_50_LEETCODE_PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    slug: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    inputFormat: 'Line 1: Space-separated integers representing nums array.\nLine 2: Single integer representing target.',
    outputFormat: 'Space-separated pair of indices [index1, index2].',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    tags: ['Array', 'Hash Table'],
    companyTags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 52.4,
    totalSubmissions: 25400,
    totalAccepted: 13310,
    testCases: [
      { id: 'tc-1', input: '2 7 11 15\n9', expectedOutput: '[0, 1]', isHidden: false },
      { id: 'tc-2', input: '3 2 4\n6', expectedOutput: '[1, 2]', isHidden: false },
      { id: 'tc-3', input: '3 3\n6', expectedOutput: '[0, 1]', isHidden: false },
      { id: 'tc-4', input: '1 5 8 10 14\n24', expectedOutput: '[3, 4]', isHidden: true }
    ]
  },
  {
    id: 'add-two-numbers',
    slug: 'add-two-numbers',
    title: '2. Add Two Numbers',
    difficulty: 'Medium',
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ],
    inputFormat: 'Two lines, each representing a list of space-separated digits.',
    outputFormat: 'Space-separated digits of the sum linked list.',
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]'
      }
    ],
    tags: ['Linked List', 'Math', 'Recursion'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def addTwoNumbers(self, l1, l2):
        pass`,
      javascript: `var addTwoNumbers = function(l1, l2) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 43.1,
    totalSubmissions: 21000,
    totalAccepted: 9051,
    testCases: [
      { id: 'atn-1', input: '2 4 3\n5 6 4', expectedOutput: '[7, 0, 8]', isHidden: false },
      { id: 'atn-2', input: '0\n0', expectedOutput: '[0]', isHidden: false }
    ]
  },
  {
    id: 'longest-substring-without-repeating-characters',
    slug: 'longest-substring-without-repeating-characters',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    inputFormat: 'Single line containing string s.',
    outputFormat: 'Single integer representing the length of the longest substring.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companyTags: ['Amazon', 'Microsoft', 'Bloomberg', 'Google', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass`,
      javascript: `var lengthOfLongestSubstring = function(s) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 34.8,
    totalSubmissions: 31200,
    totalAccepted: 10857,
    testCases: [
      { id: 'lsw-1', input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { id: 'lsw-2', input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { id: 'lsw-3', input: 'pwwkew', expectedOutput: '3', isHidden: false }
    ]
  },
  {
    id: 'median-of-two-sorted-arrays',
    slug: 'median-of-two-sorted-arrays',
    title: '4. Median of Two Sorted Arrays',
    difficulty: 'Hard',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000'
    ],
    inputFormat: 'Line 1: space-separated array nums1.\nLine 2: space-separated array nums2.',
    outputFormat: 'Single floating point number representing the median.',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    companyTags: ['Goldman Sachs', 'Amazon', 'Google', 'Apple', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        pass`,
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 39.2,
    totalSubmissions: 18900,
    totalAccepted: 7408,
    testCases: [
      { id: 'med-1', input: '1 3\n2', expectedOutput: '2.00000', isHidden: false },
      { id: 'med-2', input: '1 2\n3 4', expectedOutput: '2.50000', isHidden: false }
    ]
  },
  {
    id: 'longest-palindromic-substring',
    slug: 'longest-palindromic-substring',
    title: '5. Longest Palindromic Substring',
    difficulty: 'Medium',
    description: `Given a string \`s\`, return *the longest palindromic substring* in \`s\`.`,
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.'
    ],
    inputFormat: 'Single string s.',
    outputFormat: 'The longest palindromic substring.',
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"'
      }
    ],
    tags: ['String', 'Dynamic Programming'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        pass`,
      javascript: `var longestPalindrome = function(s) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 33.9,
    totalSubmissions: 28000,
    totalAccepted: 9492,
    testCases: [
      { id: 'lps-1', input: 'babad', expectedOutput: 'bab', isHidden: false },
      { id: 'lps-2', input: 'cbbd', expectedOutput: 'bb', isHidden: false }
    ]
  },
  {
    id: 'zigzag-conversion',
    slug: 'zigzag-conversion',
    title: '6. Zigzag Conversion',
    difficulty: 'Medium',
    description: `The string \`"PAYPALISHIRING"\` is written in a zigzag pattern on a given number of rows like this:

P   A   H   N
A P L S I I G
Y   I   R

And then read line by line: \`"PAHNAPLSIIGYIR"\`. Write the code that will take a string and make this conversion given a number of rows.`,
    constraints: [
      '1 <= s.length <= 1000',
      's consists of English letters (lower-case and upper-case), "," and ".".',
      '1 <= numRows <= 1000'
    ],
    inputFormat: 'Line 1: string s\nLine 2: integer numRows',
    outputFormat: 'Zigzag converted string.',
    examples: [
      {
        input: 's = "PAYPALISHIRING", numRows = 3',
        output: '"PAHNAPLSIIGYIR"'
      }
    ],
    tags: ['String'],
    companyTags: ['Amazon', 'Google', 'Apple', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def convert(self, s: str, numRows: int) -> str:
        pass`,
      javascript: `var convert = function(s, numRows) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 48.2,
    totalSubmissions: 14000,
    totalAccepted: 6748,
    testCases: [
      { id: 'zz-1', input: 'PAYPALISHIRING\n3', expectedOutput: 'PAHNAPLSIIGYIR', isHidden: false }
    ]
  },
  {
    id: 'reverse-integer',
    slug: 'reverse-integer',
    title: '7. Reverse Integer',
    difficulty: 'Medium',
    description: `Given a signed 32-bit integer \`x\`, return \`x\` *with its digits reversed*. If reversing \`x\` causes the value to go outside the signed 32-bit integer range \`[-2^31, 2^31 - 1]\`, then return \`0\`.`,
    constraints: [
      '-2^31 <= x <= 2^31 - 1'
    ],
    inputFormat: 'Single integer x.',
    outputFormat: 'Reversed integer or 0 if overflow.',
    examples: [
      {
        input: 'x = 123',
        output: '321'
      },
      {
        input: 'x = -123',
        output: '-321'
      }
    ],
    tags: ['Math'],
    companyTags: ['Amazon', 'Google', 'Bloomberg', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def reverse(self, x: int) -> int:
        pass`,
      javascript: `var reverse = function(x) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 28.5,
    totalSubmissions: 29000,
    totalAccepted: 8265,
    testCases: [
      { id: 'ri-1', input: '123', expectedOutput: '321', isHidden: false },
      { id: 'ri-2', input: '-123', expectedOutput: '-321', isHidden: false }
    ]
  },
  {
    id: 'string-to-integer-atoi',
    slug: 'string-to-integer-atoi',
    title: '8. String to Integer (atoi)',
    difficulty: 'Medium',
    description: `Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer (similar to C/C++'s \`atoi\` function).`,
    constraints: [
      '0 <= s.length <= 200',
      's consists of English letters (lower-case and upper-case), digits (0-9), " ", "+", "-", and ".".'
    ],
    inputFormat: 'String s.',
    outputFormat: '32-bit signed integer.',
    examples: [
      {
        input: 's = "42"',
        output: '42'
      },
      {
        input: 's = "   -42"',
        output: '-42'
      }
    ],
    tags: ['String'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def myAtoi(self, s: str) -> int:
        pass`,
      javascript: `var myAtoi = function(s) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 17.5,
    totalSubmissions: 33000,
    totalAccepted: 5775,
    testCases: [
      { id: 'atoi-1', input: '42', expectedOutput: '42', isHidden: false },
      { id: 'atoi-2', input: '   -42', expectedOutput: '-42', isHidden: false }
    ]
  },
  {
    id: 'palindrome-number',
    slug: 'palindrome-number',
    title: '9. Palindrome Number',
    difficulty: 'Easy',
    description: `Given an integer \`x\`, return \`true\` *if* \`x\` *is a palindrome, and* \`false\` *otherwise*.`,
    constraints: [
      '-2^31 <= x <= 2^31 - 1'
    ],
    inputFormat: 'Single integer x.',
    outputFormat: 'true or false.',
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: 'x = -121',
        output: 'false'
      }
    ],
    tags: ['Math'],
    companyTags: ['Amazon', 'Google', 'Apple', 'Meta', 'Microsoft'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        pass`,
      javascript: `var isPalindrome = function(x) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 56.1,
    totalSubmissions: 27000,
    totalAccepted: 15147,
    testCases: [
      { id: 'pn-1', input: '121', expectedOutput: 'true', isHidden: false },
      { id: 'pn-2', input: '-121', expectedOutput: 'false', isHidden: false }
    ]
  },
  {
    id: 'regular-expression-matching',
    slug: 'regular-expression-matching',
    title: '10. Regular Expression Matching',
    difficulty: 'Hard',
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.​​​​
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).`,
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 20',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, ".", and "*".'
    ],
    inputFormat: 'Line 1: string s\nLine 2: pattern p',
    outputFormat: 'true or false.',
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: 'false'
      },
      {
        input: 's = "aa", p = "a*"',
        output: 'true'
      }
    ],
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    companyTags: ['Google', 'Meta', 'Microsoft', 'Amazon'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        pass`,
      javascript: `var isMatch = function(s, p) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 28.1,
    totalSubmissions: 16000,
    totalAccepted: 4496,
    testCases: [
      { id: 'rem-1', input: 'aa\na', expectedOutput: 'false', isHidden: false },
      { id: 'rem-2', input: 'aa\na*', expectedOutput: 'true', isHidden: false }
    ]
  },
  {
    id: 'container-with-most-water',
    slug: 'container-with-most-water',
    title: '11. Container With Most Water',
    difficulty: 'Medium',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    inputFormat: 'Space-separated integers representing height array.',
    outputFormat: 'Maximum water area.',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49'
      }
    ],
    tags: ['Array', 'Two Pointers', 'Greedy'],
    companyTags: ['Amazon', 'Google', 'Bloomberg', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        pass`,
      javascript: `var maxArea = function(height) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 55.3,
    totalSubmissions: 22000,
    totalAccepted: 12166,
    testCases: [
      { id: 'cwmw-1', input: '1 8 6 2 5 4 8 3 7', expectedOutput: '49', isHidden: false },
      { id: 'cwmw-2', input: '1 1', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: 'integer-to-roman',
    slug: 'integer-to-roman',
    title: '12. Integer to Roman',
    difficulty: 'Medium',
    description: `Roman numerals are represented by seven different symbols: \`I\`, \`V\`, \`X\`, \`L\`, \`C\`, \`D\` and \`M\`. Given an integer, convert it to a Roman numeral.`,
    constraints: [
      '1 <= num <= 3999'
    ],
    inputFormat: 'Single integer num.',
    outputFormat: 'Roman numeral string.',
    examples: [
      {
        input: 'num = 3749',
        output: '"MMMDCCXLIX"'
      },
      {
        input: 'num = 58',
        output: '"LVIII"'
      }
    ],
    tags: ['Hash Table', 'Math', 'String'],
    companyTags: ['Amazon', 'Google', 'Apple', 'Microsoft'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def intToRoman(self, num: int) -> str:
        pass`,
      javascript: `var intToRoman = function(num) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 64.2,
    totalSubmissions: 15000,
    totalAccepted: 9630,
    testCases: [
      { id: 'itr-1', input: '3749', expectedOutput: 'MMMDCCXLIX', isHidden: false },
      { id: 'itr-2', input: '58', expectedOutput: 'LVIII', isHidden: false }
    ]
  },
  {
    id: 'roman-to-integer',
    slug: 'roman-to-integer',
    title: '13. Roman to Integer',
    difficulty: 'Easy',
    description: `Given a Roman numeral, convert it to an integer.`,
    constraints: [
      '1 <= s.length <= 15',
      's contains only the characters (\'I\', \'V\', \'X\', \'L\', \'C\', \'D\', \'M\').'
    ],
    inputFormat: 'Roman numeral string s.',
    outputFormat: 'Integer value.',
    examples: [
      {
        input: 's = "III"',
        output: '3'
      },
      {
        input: 's = "LVIII"',
        output: '58'
      }
    ],
    tags: ['Hash Table', 'Math', 'String'],
    companyTags: ['Amazon', 'Google', 'Bloomberg', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def romanToInt(self, s: str) -> int:
        pass`,
      javascript: `var romanToInt = function(s) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 61.3,
    totalSubmissions: 26000,
    totalAccepted: 15938,
    testCases: [
      { id: 'rti-1', input: 'III', expectedOutput: '3', isHidden: false },
      { id: 'rti-2', input: 'LVIII', expectedOutput: '58', isHidden: false },
      { id: 'rti-3', input: 'MCMXCIV', expectedOutput: '1994', isHidden: false }
    ]
  },
  {
    id: 'longest-common-prefix',
    slug: 'longest-common-prefix',
    title: '14. Longest Common Prefix',
    difficulty: 'Easy',
    description: `Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \`""\`.`,
    constraints: [
      '1 <= strs.length <= 200',
      '0 <= strs[i].length <= 200',
      'strs[i] consists of only lowercase English letters.'
    ],
    inputFormat: 'Space-separated strings in strs array.',
    outputFormat: 'Longest common prefix.',
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"'
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""'
      }
    ],
    tags: ['String'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Apple', 'Microsoft'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        pass`,
      javascript: `var longestCommonPrefix = function(strs) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 43.8,
    totalSubmissions: 24000,
    totalAccepted: 10512,
    testCases: [
      { id: 'lcp-1', input: 'flower flow flight', expectedOutput: 'fl', isHidden: false },
      { id: 'lcp-2', input: 'dog racecar car', expectedOutput: '', isHidden: false }
    ]
  },
  {
    id: '3sum',
    slug: '3sum',
    title: '15. 3Sum',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    inputFormat: 'Space-separated integers representing nums.',
    outputFormat: 'List of triplets summing to zero.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]'
      }
    ],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        pass`,
      javascript: `var threeSum = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 35.4,
    totalSubmissions: 27500,
    totalAccepted: 9735,
    testCases: [
      { id: '3s-1', input: '-1 0 1 2 -1 -4', expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]', isHidden: false }
    ]
  },
  {
    id: '3sum-closest',
    slug: '3sum-closest',
    title: '16. 3Sum Closest',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\` of length \`n\` and an integer \`target\`, find three integers in \`nums\` such that the sum is closest to \`target\`. Return *the sum of the three integers*.`,
    constraints: [
      '3 <= nums.length <= 500',
      '-1000 <= nums[i] <= 1000',
      '-10^4 <= target <= 10^4'
    ],
    inputFormat: 'Line 1: space-separated integers nums\nLine 2: target integer',
    outputFormat: 'The sum closest to target.',
    examples: [
      {
        input: 'nums = [-1,2,1,-4], target = 1',
        output: '2'
      }
    ],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def threeSumClosest(self, nums: list[int], target: int) -> int:
        pass`,
      javascript: `var threeSumClosest = function(nums, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 45.6,
    totalSubmissions: 16500,
    totalAccepted: 7524,
    testCases: [
      { id: '3sc-1', input: '-1 2 1 -4\n1', expectedOutput: '2', isHidden: false }
    ]
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    slug: 'letter-combinations-of-a-phone-number',
    title: '17. Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    description: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.`,
    constraints: [
      '0 <= digits.length <= 4',
      'digits[i] is a digit in the range [\'2\', \'9\'].'
    ],
    inputFormat: 'String of digits.',
    outputFormat: 'List of letter combinations.',
    examples: [
      {
        input: 'digits = "23"',
        output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]'
      }
    ],
    tags: ['Hash Table', 'String', 'Backtracking'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        pass`,
      javascript: `var letterCombinations = function(digits) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 61.2,
    totalSubmissions: 19800,
    totalAccepted: 12117,
    testCases: [
      { id: 'lc-1', input: '23', expectedOutput: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]', isHidden: false },
      { id: 'lc-2', input: '', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: '4sum',
    slug: '4sum',
    title: '18. 4Sum',
    difficulty: 'Medium',
    description: `Given an array \`nums\` of \`n\` integers, return *an array of all the unique quadruplets* \`[nums[a], nums[b], nums[c], nums[d]]\` such that \`nums[a] + nums[b] + nums[c] + nums[d] == target\`.`,
    constraints: [
      '1 <= nums.length <= 200',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    inputFormat: 'Line 1: space-separated nums\nLine 2: target integer',
    outputFormat: 'List of unique quadruplets.',
    examples: [
      {
        input: 'nums = [1,0,-1,0,-2,2], target = 0',
        output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]'
      }
    ],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companyTags: ['Amazon', 'Google', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:
        pass`,
      javascript: `var fourSum = function(nums, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 36.9,
    totalSubmissions: 14500,
    totalAccepted: 5350,
    testCases: [
      { id: '4s-1', input: '1 0 -1 0 -2 2\n0', expectedOutput: '[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]', isHidden: false }
    ]
  },
  {
    id: 'remove-nth-node-from-end-of-list',
    slug: 'remove-nth-node-from-end-of-list',
    title: '19. Remove Nth Node From End of List',
    difficulty: 'Medium',
    description: `Given the \`head\` of a linked list, remove the \`n-th\` node from the end of the list and return its head.`,
    constraints: [
      'The number of nodes in the list is sz.',
      '1 <= sz <= 30',
      '0 <= Node.val <= 100',
      '1 <= n <= sz'
    ],
    inputFormat: 'Line 1: space-separated node values\nLine 2: integer n',
    outputFormat: 'Modified linked list values.',
    examples: [
      {
        input: 'head = [1,2,3,4,5], n = 2',
        output: '[1,2,3,5]'
      }
    ],
    tags: ['Linked List', 'Two Pointers'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def removeNthFromEnd(self, head, n: int):
        pass`,
      javascript: `var removeNthFromEnd = function(head, n) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 46.5,
    totalSubmissions: 21000,
    totalAccepted: 9765,
    testCases: [
      { id: 'rnn-1', input: '1 2 3 4 5\n2', expectedOutput: '[1, 2, 3, 5]', isHidden: false },
      { id: 'rnn-2', input: '1\n1', expectedOutput: '[]', isHidden: false }
    ]
  },
  {
    id: 'valid-parentheses',
    slug: 'valid-parentheses',
    title: '20. Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    inputFormat: 'String s.',
    outputFormat: 'true or false.',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    tags: ['String', 'Stack'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
      javascript: `var isValid = function(s) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 41.2,
    totalSubmissions: 35000,
    totalAccepted: 14420,
    testCases: [
      { id: 'vp-1', input: '()', expectedOutput: 'true', isHidden: false },
      { id: 'vp-2', input: '()[]{}', expectedOutput: 'true', isHidden: false },
      { id: 'vp-3', input: '(]', expectedOutput: 'false', isHidden: false }
    ]
  },
  {
    id: 'merge-two-sorted-lists',
    slug: 'merge-two-sorted-lists',
    title: '21. Merge Two Sorted Lists',
    difficulty: 'Easy',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.`,
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.'
    ],
    inputFormat: 'Line 1: space-separated list1\nLine 2: space-separated list2',
    outputFormat: 'Merged sorted linked list values.',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]'
      }
    ],
    tags: ['Linked List', 'Recursion'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Apple', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def mergeTwoLists(self, list1, list2):
        pass`,
      javascript: `var mergeTwoLists = function(list1, list2) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 64.8,
    totalSubmissions: 28000,
    totalAccepted: 18144,
    testCases: [
      { id: 'mtsl-1', input: '1 2 4\n1 3 4', expectedOutput: '[1, 1, 2, 3, 4, 4]', isHidden: false }
    ]
  },
  {
    id: 'generate-parentheses',
    slug: 'generate-parentheses',
    title: '22. Generate Parentheses',
    difficulty: 'Medium',
    description: `Given \`n\` pairs of parentheses, write a function to *generate all combinations of well-formed parentheses*.`,
    constraints: [
      '1 <= n <= 8'
    ],
    inputFormat: 'Single integer n.',
    outputFormat: 'List of all well-formed combinations.',
    examples: [
      {
        input: 'n = 3',
        output: '["((()))","(()())","(())()","()(())","()()()"]'
      }
    ],
    tags: ['String', 'Dynamic Programming', 'Backtracking'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        pass`,
      javascript: `var generateParenthesis = function(n) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 74.5,
    totalSubmissions: 17000,
    totalAccepted: 12665,
    testCases: [
      { id: 'gp-1', input: '3', expectedOutput: '["((()))", "(()())", "(())()", "()(())", "()()()"]', isHidden: false }
    ]
  },
  {
    id: 'merge-k-sorted-lists',
    slug: 'merge-k-sorted-lists',
    title: '23. Merge k Sorted Lists',
    difficulty: 'Hard',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it.*`,
    constraints: [
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4'
    ],
    inputFormat: 'Multiple lines representing each sorted list.',
    outputFormat: 'Merged sorted list.',
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]'
      }
    ],
    tags: ['Linked List', 'Divide and Conquer', 'Heap'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def mergeKLists(self, lists):
        pass`,
      javascript: `var mergeKLists = function(lists) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 52.1,
    totalSubmissions: 16000,
    totalAccepted: 8336,
    testCases: [
      { id: 'mkl-1', input: '1 4 5\n1 3 4\n2 6', expectedOutput: '[1, 1, 2, 3, 4, 4, 5, 6]', isHidden: false }
    ]
  },
  {
    id: 'swap-nodes-in-pairs',
    slug: 'swap-nodes-in-pairs',
    title: '24. Swap Nodes in Pairs',
    difficulty: 'Medium',
    description: `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)`,
    constraints: [
      'The number of nodes in the list is in the range [0, 100].',
      '0 <= Node.val <= 100'
    ],
    inputFormat: 'Space-separated values of the linked list.',
    outputFormat: 'List after pairwise swaps.',
    examples: [
      {
        input: 'head = [1,2,3,4]',
        output: '[2,1,4,3]'
      }
    ],
    tags: ['Linked List', 'Recursion'],
    companyTags: ['Amazon', 'Microsoft', 'Bloomberg', 'Google'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def swapPairs(self, head):
        pass`,
      javascript: `var swapPairs = function(head) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 63.8,
    totalSubmissions: 15500,
    totalAccepted: 9889,
    testCases: [
      { id: 'snp-1', input: '1 2 3 4', expectedOutput: '[2, 1, 4, 3]', isHidden: false }
    ]
  },
  {
    id: 'reverse-nodes-in-k-group',
    slug: 'reverse-nodes-in-k-group',
    title: '25. Reverse Nodes in k-Group',
    difficulty: 'Hard',
    description: `Given the \`head\` of a linked list, reverse the nodes of the list \`k\` at a time, and return *the modified list*.`,
    constraints: [
      'The number of nodes in the list is n.',
      '1 <= k <= n <= 5000',
      '0 <= Node.val <= 1000'
    ],
    inputFormat: 'Line 1: space-separated node values\nLine 2: integer k',
    outputFormat: 'Modified linked list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5], k = 2',
        output: '[2,1,4,3,5]'
      }
    ],
    tags: ['Linked List', 'Recursion'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def reverseKGroup(self, head, k: int):
        pass`,
      javascript: `var reverseKGroup = function(head, k) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 58.7,
    totalSubmissions: 13000,
    totalAccepted: 7631,
    testCases: [
      { id: 'rnkg-1', input: '1 2 3 4 5\n2', expectedOutput: '[2, 1, 4, 3, 5]', isHidden: false }
    ]
  },
  {
    id: 'remove-duplicates-from-sorted-array',
    slug: 'remove-duplicates-from-sorted-array',
    title: '26. Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    description: `Given an integer array \`nums\` sorted in **non-decreasing order**, remove the duplicates **in-place** such that each unique element appears only **once**. The relative order of the elements should be kept the **same**.`,
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-100 <= nums[i] <= 100',
      'nums is sorted in non-decreasing order.'
    ],
    inputFormat: 'Space-separated nums array.',
    outputFormat: 'Unique elements count and modified array.',
    examples: [
      {
        input: 'nums = [1,1,2]',
        output: '2, nums = [1,2,_]'
      }
    ],
    tags: ['Array', 'Two Pointers'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        pass`,
      javascript: `var removeDuplicates = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 56.9,
    totalSubmissions: 31000,
    totalAccepted: 17639,
    testCases: [
      { id: 'rdfsa-1', input: '1 1 2', expectedOutput: '2', isHidden: false },
      { id: 'rdfsa-2', input: '0 0 1 1 1 2 2 3 3 4', expectedOutput: '5', isHidden: false }
    ]
  },
  {
    id: 'remove-element',
    slug: 'remove-element',
    title: '27. Remove Element',
    difficulty: 'Easy',
    description: `Given an integer array \`nums\` and an integer \`val\`, remove all occurrences of \`val\` in \`nums\` **in-place**. The order of the elements may be changed. Then return *the number of elements in* \`nums\` *which are not equal to* \`val\`.`,
    constraints: [
      '0 <= nums.length <= 100',
      '0 <= nums[i] <= 50',
      '0 <= val <= 100'
    ],
    inputFormat: 'Line 1: space-separated nums\nLine 2: integer val',
    outputFormat: 'Count of elements not equal to val.',
    examples: [
      {
        input: 'nums = [3,2,2,3], val = 3',
        output: '2, nums = [2,2,_,_]'
      }
    ],
    tags: ['Array', 'Two Pointers'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def removeElement(self, nums: list[int], val: int) -> int:
        pass`,
      javascript: `var removeElement = function(nums, val) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 57.3,
    totalSubmissions: 28500,
    totalAccepted: 16330,
    testCases: [
      { id: 're-1', input: '3 2 2 3\n3', expectedOutput: '2', isHidden: false }
    ]
  },
  {
    id: 'find-the-index-of-the-first-occurrence-in-a-string',
    slug: 'find-the-index-of-the-first-occurrence-in-a-string',
    title: '28. Find the Index of the First Occurrence in a String',
    difficulty: 'Easy',
    description: `Given two strings \`needle\` and \`haystack\`, return the index of the first occurrence of \`needle\` in \`haystack\`, or \`-1\` if \`needle\` is not part of \`haystack\`.`,
    constraints: [
      '1 <= haystack.length, needle.length <= 10^4',
      'haystack and needle consist of only lowercase English characters.'
    ],
    inputFormat: 'Line 1: haystack\nLine 2: needle',
    outputFormat: 'Index integer (-1 if not found).',
    examples: [
      {
        input: 'haystack = "sadbutsad", needle = "sad"',
        output: '0'
      }
    ],
    tags: ['Two Pointers', 'String'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        pass`,
      javascript: `var strStr = function(haystack, needle) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 43.1,
    totalSubmissions: 23000,
    totalAccepted: 9913,
    testCases: [
      { id: 'fo-1', input: 'sadbutsad\nsad', expectedOutput: '0', isHidden: false },
      { id: 'fo-2', input: 'leetcode\nleeto', expectedOutput: '-1', isHidden: false }
    ]
  },
  {
    id: 'divide-two-integers',
    slug: 'divide-two-integers',
    title: '29. Divide Two Integers',
    difficulty: 'Medium',
    description: `Given two integers \`dividend\` and \`divisor\`, divide two integers **without** using multiplication, division, and mod operator.`,
    constraints: [
      '-2^31 <= dividend, divisor <= 2^31 - 1',
      'divisor != 0'
    ],
    inputFormat: 'Line 1: dividend\nLine 2: divisor',
    outputFormat: 'Quotient integer.',
    examples: [
      {
        input: 'dividend = 10, divisor = 3',
        output: '3'
      }
    ],
    tags: ['Math', 'Bit Manipulation'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def divide(self, dividend: int, divisor: int) -> int:
        pass`,
      javascript: `var divide = function(dividend, divisor) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 17.8,
    totalSubmissions: 19500,
    totalAccepted: 3471,
    testCases: [
      { id: 'dti-1', input: '10\n3', expectedOutput: '3', isHidden: false }
    ]
  },
  {
    id: 'substring-with-concatenation-of-all-words',
    slug: 'substring-with-concatenation-of-all-words',
    title: '30. Substring with Concatenation of All Words',
    difficulty: 'Hard',
    description: `You are given a string \`s\` and an array of strings \`words\` of **the same length**. Return all starting indices of substring(s) in \`s\` that is a concatenation of each word in \`words\` exactly once, in any order, and without any intervening characters.`,
    constraints: [
      '1 <= s.length <= 10^4',
      '1 <= words.length <= 5000',
      '1 <= words[i].length <= 30'
    ],
    inputFormat: 'Line 1: string s\nLine 2: space-separated words array',
    outputFormat: 'List of starting indices.',
    examples: [
      {
        input: 's = "barfoothefoobarman", words = ["foo","bar"]',
        output: '[0,9]'
      }
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def findSubstring(self, s: str, words: list[str]) -> list[int]:
        pass`,
      javascript: `var findSubstring = function(s, words) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 31.5,
    totalSubmissions: 14000,
    totalAccepted: 4410,
    testCases: [
      { id: 'swc-1', input: 'barfoothefoobarman\nfoo bar', expectedOutput: '[0, 9]', isHidden: false }
    ]
  },
  {
    id: 'next-permutation',
    slug: 'next-permutation',
    title: '31. Next Permutation',
    difficulty: 'Medium',
    description: `A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.

Find the next lexicographically greater permutation of \`nums\`. If not possible, rearrange it as the lowest possible order (i.e., sorted in ascending order). Must be in-place.`,
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 100'
    ],
    inputFormat: 'Space-separated nums array.',
    outputFormat: 'Array after modification.',
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[1,3,2]'
      }
    ],
    tags: ['Array', 'Two Pointers'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def nextPermutation(self, nums: list[int]) -> None:
        pass`,
      javascript: `var nextPermutation = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 40.8,
    totalSubmissions: 21000,
    totalAccepted: 8568,
    testCases: [
      { id: 'np-1', input: '1 2 3', expectedOutput: '[1, 3, 2]', isHidden: false },
      { id: 'np-2', input: '3 2 1', expectedOutput: '[1, 2, 3]', isHidden: false }
    ]
  },
  {
    id: 'longest-valid-parentheses',
    slug: 'longest-valid-parentheses',
    title: '32. Longest Valid Parentheses',
    difficulty: 'Hard',
    description: `Given a string containing just the characters \`'('\` and \`')'\`, return *the length of the longest valid (well-formed) parentheses substring*.`,
    constraints: [
      '0 <= s.length <= 3 * 10^4',
      's[i] is \'(\', or \')\'.'
    ],
    inputFormat: 'String s.',
    outputFormat: 'Length integer.',
    examples: [
      {
        input: 's = "(()"',
        output: '2'
      },
      {
        input: 's = ")()())"',
        output: '4'
      }
    ],
    tags: ['String', 'Dynamic Programming', 'Stack'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def longestValidParentheses(self, s: str) -> int:
        pass`,
      javascript: `var longestValidParentheses = function(s) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 34.2,
    totalSubmissions: 17500,
    totalAccepted: 5985,
    testCases: [
      { id: 'lvp-1', input: '(()', expectedOutput: '2', isHidden: false },
      { id: 'lvp-2', input: ')()())', expectedOutput: '4', isHidden: false }
    ]
  },
  {
    id: 'search-in-rotated-sorted-array',
    slug: 'search-in-rotated-sorted-array',
    title: '33. Search in Rotated Sorted Array',
    difficulty: 'Medium',
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values) which has been rotated at an unknown pivot. Given the array \`nums\` after rotation and an integer \`target\`, return *the index of* \`target\` *if it is in* \`nums\`, *or* \`-1\` *if it is not in* \`nums\`.`,
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i], target <= 10^4'
    ],
    inputFormat: 'Line 1: space-separated nums\nLine 2: target integer',
    outputFormat: 'Index integer (-1 if not found).',
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4'
      }
    ],
    tags: ['Array', 'Binary Search'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        pass`,
      javascript: `var search = function(nums, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 40.5,
    totalSubmissions: 25000,
    totalAccepted: 10125,
    testCases: [
      { id: 'srsa-1', input: '4 5 6 7 0 1 2\n0', expectedOutput: '4', isHidden: false }
    ]
  },
  {
    id: 'find-first-and-last-position-of-element-in-sorted-array',
    slug: 'find-first-and-last-position-of-element-in-sorted-array',
    title: '34. Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    description: `Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value.

If \`target\` is not found in the array, return \`[-1, -1]\`.`,
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i], target <= 10^9'
    ],
    inputFormat: 'Line 1: space-separated nums\nLine 2: target integer',
    outputFormat: 'Two space-separated range indices [start, end].',
    examples: [
      {
        input: 'nums = [5,7,7,8,8,10], target = 8',
        output: '[3,4]'
      }
    ],
    tags: ['Array', 'Binary Search'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        pass`,
      javascript: `var searchRange = function(nums, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 44.2,
    totalSubmissions: 22000,
    totalAccepted: 9724,
    testCases: [
      { id: 'fflp-1', input: '5 7 7 8 8 10\n8', expectedOutput: '[3, 4]', isHidden: false }
    ]
  },
  {
    id: 'search-insert-position',
    slug: 'search-insert-position',
    title: '35. Search Insert Position',
    difficulty: 'Easy',
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.`,
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 <= nums[i], target <= 10^4'
    ],
    inputFormat: 'Line 1: space-separated nums\nLine 2: target integer',
    outputFormat: 'Insert index integer.',
    examples: [
      {
        input: 'nums = [1,3,5,6], target = 5',
        output: '2'
      },
      {
        input: 'nums = [1,3,5,6], target = 2',
        output: '1'
      }
    ],
    tags: ['Array', 'Binary Search'],
    companyTags: ['Amazon', 'Google', 'Apple', 'Microsoft'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        pass`,
      javascript: `var searchInsert = function(nums, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 46.8,
    totalSubmissions: 29000,
    totalAccepted: 13572,
    testCases: [
      { id: 'sip-1', input: '1 3 5 6\n5', expectedOutput: '2', isHidden: false },
      { id: 'sip-2', input: '1 3 5 6\n2', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: 'valid-sudoku',
    slug: 'valid-sudoku',
    title: '36. Valid Sudoku',
    difficulty: 'Medium',
    description: `Determine if a \`9 x 9\` Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
1. Each row must contain the digits \`1-9\` without repetition.
2. Each column must contain the digits \`1-9\` without repetition.
3. Each of the nine \`3 x 3\` sub-boxes must contain the digits \`1-9\` without repetition.`,
    constraints: [
      'board.length == 9',
      'board[i].length == 9',
      'board[i][j] is a digit 1-9 or \'.\'.'
    ],
    inputFormat: '9 rows of 9 characters.',
    outputFormat: 'true or false.',
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."], ...]',
        output: 'true'
      }
    ],
    tags: ['Array', 'Hash Table', 'Matrix'],
    companyTags: ['Amazon', 'Google', 'Apple', 'Microsoft', 'Uber'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        pass`,
      javascript: `var isValidSudoku = function(board) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 59.4,
    totalSubmissions: 18000,
    totalAccepted: 10692,
    testCases: [
      { id: 'vs-1', input: '5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9', expectedOutput: 'true', isHidden: false }
    ]
  },
  {
    id: 'sudoku-solver',
    slug: 'sudoku-solver',
    title: '37. Sudoku Solver',
    difficulty: 'Hard',
    description: `Write a program to solve a Sudoku puzzle by filling the empty cells.`,
    constraints: [
      'board.length == 9',
      'board[i].length == 9',
      'It is guaranteed that the input board has only one solution.'
    ],
    inputFormat: '9 rows of 9 characters representing the board.',
    outputFormat: '9 rows of solved 9 characters.',
    examples: [
      {
        input: 'board = [["5","3",".",".","7", ...]]',
        output: '[["5","3","4","6","7", ...]]'
      }
    ],
    tags: ['Array', 'Backtracking', 'Matrix'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        pass`,
      javascript: `var solveSudoku = function(board) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 61.8,
    totalSubmissions: 13000,
    totalAccepted: 8034,
    testCases: [
      { id: 'ss-1', input: '5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9', expectedOutput: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9', isHidden: false }
    ]
  },
  {
    id: 'count-and-say',
    slug: 'count-and-say',
    title: '38. Count and Say',
    difficulty: 'Medium',
    description: `The **count-and-say** sequence is a sequence of digit strings defined by the recursive formula:
- \`countAndSay(1) = "1"\`
- \`countAndSay(n)\` is the run-length encoding of \`countAndSay(n - 1)\`.`,
    constraints: [
      '1 <= n <= 30'
    ],
    inputFormat: 'Single integer n.',
    outputFormat: 'The count-and-say string for n.',
    examples: [
      {
        input: 'n = 4',
        output: '"1211"',
        explanation: 'countAndSay(1) = "1", countAndSay(2) = "11", countAndSay(3) = "21", countAndSay(4) = "1211".'
      }
    ],
    tags: ['String'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def countAndSay(self, n: int) -> str:
        pass`,
      javascript: `var countAndSay = function(n) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 55.4,
    totalSubmissions: 17000,
    totalAccepted: 9418,
    testCases: [
      { id: 'cas-1', input: '4', expectedOutput: '1211', isHidden: false }
    ]
  },
  {
    id: 'combination-sum',
    slug: 'combination-sum',
    title: '39. Combination Sum',
    difficulty: 'Medium',
    description: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return *a list of all **unique combinations** of* \`candidates\` *where the chosen numbers sum to* \`target\`. You may return the combinations in **any order**.

The **same** number may be chosen from \`candidates\` an **unlimited number of times**.`,
    constraints: [
      '1 <= candidates.length <= 30',
      '2 <= candidates[i] <= 40',
      '1 <= target <= 40'
    ],
    inputFormat: 'Line 1: candidates array\nLine 2: target integer',
    outputFormat: 'List of combination lists.',
    examples: [
      {
        input: 'candidates = [2,3,6,7], target = 7',
        output: '[[2,2,3],[7]]'
      }
    ],
    tags: ['Array', 'Backtracking'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        pass`,
      javascript: `var combinationSum = function(candidates, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 70.8,
    totalSubmissions: 24000,
    totalAccepted: 16992,
    testCases: [
      { id: 'cs-1', input: '2 3 6 7\n7', expectedOutput: '[[2, 2, 3], [7]]', isHidden: false }
    ]
  },
  {
    id: 'combination-sum-ii',
    slug: 'combination-sum-ii',
    title: '40. Combination Sum II',
    difficulty: 'Medium',
    description: `Given a collection of candidate numbers (\`candidates\`) and a target number (\`target\`), find all unique combinations in \`candidates\` where the candidate numbers sum to \`target\`.

Each number in \`candidates\` may only be used **once** in the combination.`,
    constraints: [
      '1 <= candidates.length <= 100',
      '1 <= candidates[i] <= 50',
      '1 <= target <= 30'
    ],
    inputFormat: 'Line 1: candidates array\nLine 2: target integer',
    outputFormat: 'List of unique combination lists.',
    examples: [
      {
        input: 'candidates = [10,1,2,7,6,1,5], target = 8',
        output: '[[1,1,6],[1,2,5],[1,7],[2,6]]'
      }
    ],
    tags: ['Array', 'Backtracking'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        pass`,
      javascript: `var combinationSum2 = function(candidates, target) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 54.8,
    totalSubmissions: 16000,
    totalAccepted: 8768,
    testCases: [
      { id: 'cs2-1', input: '10 1 2 7 6 1 5\n8', expectedOutput: '[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]', isHidden: false }
    ]
  },
  {
    id: 'first-missing-positive',
    slug: 'first-missing-positive',
    title: '41. First Missing Positive',
    difficulty: 'Hard',
    description: `Given an unsorted integer array \`nums\`, return the smallest missing positive integer.

You must implement an algorithm that runs in \`O(n)\` time and uses \`O(1)\` auxiliary space.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1'
    ],
    inputFormat: 'Space-separated nums array.',
    outputFormat: 'Smallest missing positive integer.',
    examples: [
      {
        input: 'nums = [1,2,0]',
        output: '3'
      },
      {
        input: 'nums = [3,4,-1,1]',
        output: '2'
      }
    ],
    tags: ['Array', 'Hash Table'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        pass`,
      javascript: `var firstMissingPositive = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 38.4,
    totalSubmissions: 22000,
    totalAccepted: 8448,
    testCases: [
      { id: 'fmp-1', input: '1 2 0', expectedOutput: '3', isHidden: false },
      { id: 'fmp-2', input: '3 4 -1 1', expectedOutput: '2', isHidden: false }
    ]
  },
  {
    id: 'trapping-rain-water',
    slug: 'trapping-rain-water',
    title: '42. Trapping Rain Water',
    difficulty: 'Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    inputFormat: 'Space-separated non-negative integers.',
    outputFormat: 'Single integer representing total trapped rain water.',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.'
      }
    ],
    tags: ['Array', 'Two Pointers', 'Stack'],
    companyTags: ['Goldman Sachs', 'Amazon', 'Google', 'Apple', 'Uber'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        pass`,
      javascript: `var trap = function(height) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 60.5,
    totalSubmissions: 26000,
    totalAccepted: 15730,
    testCases: [
      { id: 'trw-1', input: '0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { id: 'trw-2', input: '4 2 0 3 2 5', expectedOutput: '9', isHidden: false }
    ]
  },
  {
    id: 'multiply-strings',
    slug: 'multiply-strings',
    title: '43. Multiply Strings',
    difficulty: 'Medium',
    description: `Given two non-negative integers \`num1\` and \`num2\` represented as strings, return the product of \`num1\` and \`num2\`, also represented as a string.

**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.`,
    constraints: [
      '1 <= num1.length, num2.length <= 200',
      'num1 and num2 consist of digits only.'
    ],
    inputFormat: 'Line 1: num1 string\nLine 2: num2 string',
    outputFormat: 'Product string.',
    examples: [
      {
        input: 'num1 = "2", num2 = "3"',
        output: '"6"'
      },
      {
        input: 'num1 = "123", num2 = "456"',
        output: '"56088"'
      }
    ],
    tags: ['Math', 'String', 'Simulation'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        pass`,
      javascript: `var multiply = function(num1, num2) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 40.2,
    totalSubmissions: 18000,
    totalAccepted: 7236,
    testCases: [
      { id: 'ms-1', input: '2\n3', expectedOutput: '6', isHidden: false },
      { id: 'ms-2', input: '123\n456', expectedOutput: '56088', isHidden: false }
    ]
  },
  {
    id: 'wildcard-matching',
    slug: 'wildcard-matching',
    title: '44. Wildcard Matching',
    difficulty: 'Hard',
    description: `Given an input string (\`s\`) and a pattern (\`p\`), implement wildcard pattern matching with support for \`'?'\` and \`'*'\` where:
- \`'?'\` Matches any single character.
- \`'*'\` Matches any sequence of characters (including the empty sequence).`,
    constraints: [
      '0 <= s.length, p.length <= 2000'
    ],
    inputFormat: 'Line 1: string s\nLine 2: pattern p',
    outputFormat: 'true or false.',
    examples: [
      {
        input: 's = "aa", p = "*"',
        output: 'true'
      }
    ],
    tags: ['String', 'Dynamic Programming', 'Greedy'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        pass`,
      javascript: `var isMatch = function(s, p) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 27.8,
    totalSubmissions: 14000,
    totalAccepted: 3892,
    testCases: [
      { id: 'wm-1', input: 'aa\n*', expectedOutput: 'true', isHidden: false }
    ]
  },
  {
    id: 'jump-game-ii',
    slug: 'jump-game-ii',
    title: '45. Jump Game II',
    difficulty: 'Medium',
    description: `You are given a **0-indexed** array of integers \`nums\` of length \`n\`. You are initially positioned at \`nums[0]\`.

Each element \`nums[i]\` represents the maximum length of a forward jump from index \`i\`. Return *the minimum number of jumps to reach* \`nums[n - 1]\`.`,
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 1000'
    ],
    inputFormat: 'Space-separated nums array.',
    outputFormat: 'Minimum jumps integer.',
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: '2',
        explanation: 'The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.'
      }
    ],
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def jump(self, nums: list[int]) -> int:
        pass`,
      javascript: `var jump = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 40.9,
    totalSubmissions: 24000,
    totalAccepted: 9816,
    testCases: [
      { id: 'jg2-1', input: '2 3 1 1 4', expectedOutput: '2', isHidden: false }
    ]
  },
  {
    id: 'permutations',
    slug: 'permutations',
    title: '46. Permutations',
    difficulty: 'Medium',
    description: `Given an array \`nums\` of distinct integers, return all the possible permutations. You can return the answer in **any order**.`,
    constraints: [
      '1 <= nums.length <= 6',
      '-10 <= nums[i] <= 10',
      'All the integers of nums are unique.'
    ],
    inputFormat: 'Space-separated distinct integers.',
    outputFormat: 'List of permutation lists.',
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'
      }
    ],
    tags: ['Array', 'Backtracking'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        pass`,
      javascript: `var permute = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 78.4,
    totalSubmissions: 27000,
    totalAccepted: 21168,
    testCases: [
      { id: 'perm-1', input: '1 2 3', expectedOutput: '[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]', isHidden: false }
    ]
  },
  {
    id: 'permutations-ii',
    slug: 'permutations-ii',
    title: '47. Permutations II',
    difficulty: 'Medium',
    description: `Given a collection of numbers, \`nums\`, that might contain duplicates, return *all possible unique permutations in any order*.`,
    constraints: [
      '1 <= nums.length <= 8',
      '-10 <= nums[i] <= 10'
    ],
    inputFormat: 'Space-separated integers.',
    outputFormat: 'List of unique permutation lists.',
    examples: [
      {
        input: 'nums = [1,1,2]',
        output: '[[1,1,2],[1,2,1],[2,1,1]]'
      }
    ],
    tags: ['Array', 'Backtracking'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def permuteUnique(self, nums: list[int]) -> list[list[int]]:
        pass`,
      javascript: `var permuteUnique = function(nums) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 59.8,
    totalSubmissions: 16000,
    totalAccepted: 9568,
    testCases: [
      { id: 'p2-1', input: '1 1 2', expectedOutput: '[[1, 1, 2], [1, 2, 1], [2, 1, 1]]', isHidden: false }
    ]
  },
  {
    id: 'rotate-image',
    slug: 'rotate-image',
    title: '48. Rotate Image',
    difficulty: 'Medium',
    description: `You are given an \`n x n\` 2D matrix representing an image, rotate the image by **90 degrees (clockwise)**.

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly.`,
    constraints: [
      'matrix.length == n',
      'matrix[i].length == n',
      '1 <= n <= 20'
    ],
    inputFormat: '2D array representing n x n matrix.',
    outputFormat: 'Rotated 2D matrix.',
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[[7,4,1],[8,5,2],[9,6,3]]'
      }
    ],
    tags: ['Array', 'Math', 'Matrix'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Apple', 'Meta'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        pass`,
      javascript: `var rotate = function(matrix) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 74.8,
    totalSubmissions: 21000,
    totalAccepted: 15708,
    testCases: [
      { id: 'ri-mat-1', input: '1 2 3\n4 5 6\n7 8 9', expectedOutput: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]', isHidden: false }
    ]
  },
  {
    id: 'group-anagrams',
    slug: 'group-anagrams',
    title: '49. Group Anagrams',
    difficulty: 'Medium',
    description: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.`,
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    inputFormat: 'Space-separated strings.',
    outputFormat: 'List of grouped anagram lists.',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]'
      }
    ],
    tags: ['Array', 'Hash Table', 'String'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        pass`,
      javascript: `var groupAnagrams = function(strs) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 68.2,
    totalSubmissions: 29000,
    totalAccepted: 19778,
    testCases: [
      { id: 'ga-1', input: 'eat tea tan ate nat bat', expectedOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]', isHidden: false }
    ]
  },
  {
    id: 'powx-n',
    slug: 'powx-n',
    title: '50. Pow(x, n)',
    difficulty: 'Medium',
    description: `Implement \`pow(x, n)\`, which calculates \`x\` raised to the power \`n\` (i.e., \`x^n\`).`,
    constraints: [
      '-100.0 < x < 100.0',
      '-2^31 <= n <= 2^31 - 1',
      '-10^4 <= x^n <= 10^4'
    ],
    inputFormat: 'Line 1: float x\nLine 2: integer n',
    outputFormat: 'Floating point value x^n.',
    examples: [
      {
        input: 'x = 2.00000, n = 10',
        output: '1024.00000'
      },
      {
        input: 'x = 2.10000, n = 3',
        output: '9.26100'
      }
    ],
    tags: ['Math', 'Recursion'],
    companyTags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        pass`,
      javascript: `var myPow = function(x, n) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 34.9,
    totalSubmissions: 24000,
    totalAccepted: 8376,
    testCases: [
      { id: 'pow-1', input: '2.00000\n10', expectedOutput: '1024.00000', isHidden: false },
      { id: 'pow-2', input: '2.10000\n3', expectedOutput: '9.26100', isHidden: false }
    ]
  },
  {
    id: 'lru-cache',
    slug: 'lru-cache',
    title: '146. LRU Cache',
    difficulty: 'Medium',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with **positive** size capacity.
- \`int get(int key)\` Return the value of the key if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    inputFormat: 'Commands and parameters line by line.',
    outputFormat: 'Results of operations line by line.',
    examples: [
      {
        input: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1',
        output: '[null, null, null, 1]'
      }
    ],
    tags: ['Hash Table', 'Linked List', 'Design'],
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Bloomberg'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass`,
      javascript: `var LRUCache = function(capacity) {
    
};
LRUCache.prototype.get = function(key) {
    
};
LRUCache.prototype.put = function(key, value) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 42.1,
    totalSubmissions: 31000,
    totalAccepted: 13051,
    testCases: [
      { id: 'lru-1', input: 'capacity=2\nput 1 1\nput 2 2\nget 1', expectedOutput: '1', isHidden: false }
    ]
  },
  {
    id: 'valid-anagram',
    slug: 'valid-anagram',
    title: '242. Valid Anagram',
    difficulty: 'Easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` *if* \`t\` *is an anagram of* \`s\`, *and* \`false\` *otherwise*.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    inputFormat: 'Line 1: string s\nLine 2: string t',
    outputFormat: 'true or false.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false'
      }
    ],
    tags: ['Hash Table', 'String', 'Sorting'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    timeLimitMs: 2000,
    memoryLimitMB: 128,
    starterCode: {
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass`,
      javascript: `var isAnagram = function(s, t) {
    
};`
    },
    correctSolution: {},
    status: 'published',
    acceptanceRate: 64.9,
    totalSubmissions: 32000,
    totalAccepted: 20768,
    testCases: [
      { id: 'va-1', input: 'anagram\nnagaram', expectedOutput: 'true', isHidden: false },
      { id: 'va-2', input: 'rat\ncar', expectedOutput: 'false', isHidden: false }
    ]
  }
];
