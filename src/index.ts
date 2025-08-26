interface INameMatchResult {
    result: Boolean,
    score: number,
    name_1: string,
    name_2: string,
    normalised_name_1: string,
    normalised_name_2: string
}

interface INameMatchConfig {
    firstNameWeightage?: number;
    reverseScoreThreshold?: number;
    nameMatchThreshold?: number;
}

const defaultConfig: Required<INameMatchConfig> = {
    firstNameWeightage: 70,
    reverseScoreThreshold: 90,
    nameMatchThreshold: 80,
};

const checkEmpty = (value: any): boolean => {
    if (value === null || value === undefined) {
      return true;
    }
  
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === 0;
    }
  
    return false;
};

const similarText = (x : string, y : string) => {
    const length = (string1 : string, string2 : string) => {
        const length1 = string1.length;
        const length2 = string2.length;
        const dp = Array.from({ length: length1 + 1 }, () => Array(length2 + 1).fill(0));

        for (let i = 1; i <= length1; i++) {
            for (let j = 1; j <= length2; j++) {
                if (string1[i - 1] === string2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[length1][length2];
    };

    const longestCommonSubsequentLength = length(x.toLowerCase(), y.toLowerCase());
    return ((longestCommonSubsequentLength * 2) / (x.length + y.length)) * 100;
};

function compareTokens(token1: string, token2: string): number {
    if (!token1 || !token2) return 0;
  
    const t1 = token1.toLowerCase();
    const t2 = token2.toLowerCase();
  
    // Exact match
    if (t1 === t2) return 100;
  
    // Initial vs full name (e.g. "K" vs "Kumar")
    if (t1.length === 1 && t2.startsWith(t1)) return 85;
    if (t2.length === 1 && t1.startsWith(t2)) return 85;
  
    // Fallback to normal similarity
    return similarText(t1, t2);
}

const permute = (arr: string[]): string[][] => {
    if (arr.length <= 1) return [arr];
    const result: string[][] = [];
    arr.forEach((word, idx) => {
        const remaining = [...arr.slice(0, idx), ...arr.slice(idx + 1)];
        for (const perm of permute(remaining)) {
            result.push([word, ...perm]);
        }
    });
    return result;
};

const nameMatchResult = (name1 : string, name2 : string, config: INameMatchConfig = {}) : INameMatchResult=> {
    const { firstNameWeightage, reverseScoreThreshold, nameMatchThreshold } = {
        ...defaultConfig,
        ...config,
    };

    if (checkEmpty(name1) || checkEmpty(name2)) {
        return {
            result: false,
            score: 0,
            name_1: name1,
            name_2: name2,
            normalised_name_1: "",
            normalised_name_2: ""
        };
    }

    const prefix = /^(shri |shri\. |sh\. |smt |smt\. |m\/s |m\/s\. |mrs |mrs\. |mr |mr\. |miss |miss\. |ms |ms\. )/i;
    const filteredname1 = name1.toLowerCase().replace(prefix, "").trim();
    const filteredname2 = name2.toLowerCase().replace(prefix, "").trim();

    const fullname1 = filteredname1.split(" ");
    const fullname2 = filteredname2.split(" ");

    let nameMatchScore: number;
    let result: boolean;

    if (fullname1.length <= 2 && fullname2.length <= 2) { 
        const firstname1 = fullname1[0] ?? "";
        const lastname1 = fullname1.slice(1).join(" ") ?? "";
        const firstName2 = fullname2[0] ?? "";
        const lastName2 = fullname2.slice(1).join(" ") ?? "";

        console.log(fullname1, fullname1.length)
        console.log({firstname1, lastname1,firstName2, lastName2})
        let reverseCheckScore : number;
        let firstLastNameScore : number;
        let lastFirstNameScore : number;

        const firstnameScore = compareTokens(firstname1, firstName2);

        if(!checkEmpty(lastname1) && !checkEmpty(lastName2)) {
            const lastnameScore = compareTokens(lastname1, lastName2);
        
            nameMatchScore = ((firstnameScore * firstNameWeightage) + (lastnameScore * (100 - firstNameWeightage)))/100;

            if(firstname1.length == lastName2.length) {
                firstLastNameScore = compareTokens(firstname1, lastName2);
            } else {
                firstLastNameScore = 0;
            }
        
            if(lastname1.length == firstName2.length) {
                lastFirstNameScore = compareTokens(lastname1, firstName2);
            } else {
                lastFirstNameScore = 0;
            }

            if((firstLastNameScore >= 90) && (lastFirstNameScore >= 90)) {
                reverseCheckScore = (firstLastNameScore + lastFirstNameScore)/2;
            } else {
                reverseCheckScore = 0;
            }
            
        } else {
            nameMatchScore = firstnameScore;
            reverseCheckScore = firstnameScore;
        }
    
        nameMatchScore = reverseCheckScore >= reverseScoreThreshold ? reverseCheckScore : nameMatchScore;
    } else {
        const permutations = permute(fullname1);
        let bestScore = 0;

        console.log({permutations})

        for (const perm of permutations) {
            const permStr = perm.join(" ");
            const score = compareTokens(permStr, filteredname2);
            if (score > bestScore) {
                bestScore = score;
            }
            if (bestScore === 100) break; // perfect match → early exit
        }

        nameMatchScore = bestScore;
    }

    result = Number(nameMatchScore.toFixed(2)) >= nameMatchThreshold;

    return {
        result,
        score: Number(nameMatchScore.toFixed(2)),
        name_1: name1,
        name_2: name2,
        normalised_name_1: filteredname1,
        normalised_name_2: filteredname2,
    };
};

console.log(nameMatchResult('Mr. Niraj kumar Mishra', 'Nirbhay k Mishra'))

export {nameMatchResult};