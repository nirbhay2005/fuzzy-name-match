🔎 fuzzy-name-match

A lightweight utility to compare and match names with fuzzy string similarity.
It helps in detecting whether two names refer to the same person, even if they are spelled differently, abbreviated, or contain prefixes like Mr., Mrs., Shri, etc.

✨ Features

✅ Detects fuzzy matches between two names.
✅ Handles common prefixes like Mr., Mrs., Shri, Ms., etc.
✅ Supports initials vs full name (Kumar vs K).
✅ Configurable thresholds for accuracy and flexibility.
✅ Works with single names, first+last names, and multi-part names.

📥 Installation
npm install fuzzy-name-match
# or
yarn add fuzzy-name-match

🚀 Usage
Basic Example

import { nameMatchResult } from "fuzzy-name-match";

const result = nameMatchResult("Mr. Niraj Kumar Mishra", "Nirbhay K Mishra");

console.log(result);
/*
{
  result: true,
  score: 86.67,
  name_1: 'Mr. Niraj Kumar Mishra',
  name_2: 'Nirbhay K Mishra',
  normalised_name_1: 'niraj kumar mishra',
  normalised_name_2: 'nirbhay k mishra'
}
*/

Example: With Initials

import { nameMatchResult } from "fuzzy-name-match";

const result = nameMatchResult("S. Ramesh", "Suresh Ramesh");

console.log(result.result); // true
console.log(result.score);  // ~85

Example: No Match

const result = nameMatchResult("Amit Sharma", "Rahul Verma");
console.log(result.result); // false

⚙️ Configuration

You can fine-tune the matching behavior using an optional config object:

interface INameMatchConfig {
  firstNameWeightage?: number;     // Weight given to first name (default: 70)
  reverseScoreThreshold?: number;  // Threshold for reverse name order (default: 90)
  nameMatchThreshold?: number;     // Final match threshold (default: 80)
}

Example with Config

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

🧪 Return Format

Each call to nameMatchResult returns:
interface INameMatchResult {
  result: boolean;          // true if names match above threshold
  score: number;            // similarity score (0–100)
  name_1: string;           // original input name 1
  name_2: string;           // original input name 2
  normalised_name_1: string; // lowercased + cleaned name1
  normalised_name_2: string; // lowercased + cleaned name2
}

📌 Use Cases

🧾 Data cleaning: Matching customer names across multiple databases.
🏦 Banking/Finance: Identifying duplicate KYC records.
🎓 Education: Matching student records where names are spelled differently.
🛒 E-commerce: Deduplicating customer accounts.

git clone https://github.com/nirbhay2005/fuzzy-name-match.git
cd fuzzy-name-match
npm install
npm run build

🤝 Contributing

Contributions, issues and feature requests are welcome!
Open an issue or submit a PR.

📜 License
MIT © Nirbhay Mishra