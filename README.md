# Fuzzy Name Match

A lightweight and flexible fuzzy name matching library for Node.js, designed to handle variations, abbreviations, and reversed orders in personal names.

[![npm version](https://img.shields.io/npm/v/fuzzy-name-match.svg)](https://www.npmjs.com/package/fuzzy-name-match)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Name-Specific Matching**: Handles reversed names, abbreviations, and spacing variations
- **Configurable Thresholds**: Control sensitivity of matches
- **Abbreviation Support**: Detects and matches initials against full names
- **Flexible Comparison**: Compare single pairs or batches of names
- **Lightweight**: No heavy dependencies, works fast with Node.js projects

## Installation

```bash
npm install fuzzy-name-match
```

## Quick Start

```javascript
const { nameMatchResult } = require('fuzzy-name-match');

// Compare two names and get detailed result
const result = nameMatchResult('Mr. Adam George Clooney', 'Adam G Clooney');

console.log(result);
/*
{
  result: true,
  score: 84.85,
  name_1: 'Mr. Adam George Clooney',
  name_2: 'Adam G Clooney',
  normalised_name_1: 'adam george clooney',
  normalised_name_2: 'adam g clooney'
}
*/
```

## Detailed Usage
### With Initials

```javascript
import { nameMatchResult } from "fuzzy-name-match";

const result = nameMatchResult("S. Tendulkar", "Sachin Tendulkar");

console.log(result.result); // true
console.log(result.score);  // ~85
```

### No Match

```javascript
const result = nameMatchResult("Virat Kohli", "Rohit Sharma");
console.log(result.result); // false
```

## Configuration

You can fine-tune the matching behavior using an optional config object:

```javascript
interface INameMatchConfig {
  firstNameWeightage?: number;     // Weight given to first name (default: 70)
  reverseScoreThreshold?: number;  // Threshold for reverse name order (default: 90)
  nameMatchThreshold?: number;     // Final match threshold (default: 80)
}
```

Example with Config

```javascript
const result = nameMatchResult("Ramesh Kumar", "Kumar Ramesh", {
  nameMatchThreshold: 85,
  reverseScoreThreshold: 85,
});

console.log(result);
/*
{
  result: true,
  score: 90,
  ...
}
*/
```

## Return Format
Each call to nameMatchResult returns:

```javascript
interface INameMatchResult {
  result: boolean;          // true if names match above threshold
  score: number;            // similarity score (0–100)
  name_1: string;           // original input name 1
  name_2: string;           // original input name 2
  normalised_name_1: string; // lowercased + cleaned name1
  normalised_name_2: string; // lowercased + cleaned name2
}
```

## Use Cases

- Data cleaning: Matching customer names across multiple databases.
- Banking/Finance: Identifying duplicate KYC records.
- Education: Matching student records where names are spelled differently.
- E-commerce: Deduplicating customer accounts.
## Challenges Handled

- Reversed names (first last vs last, first)
- Abbreviations and initials
- Middle names and missing parts
- Spacing and case variations
- Common nickname handling (configurable)

## License

MIT