
export function levenshteinDistance(s1, s2) {
    const a = s1.toLowerCase();
    const b = s2.toLowerCase();
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, 
                    matrix[i][j - 1] + 1,     
                    matrix[i - 1][j] + 1      
                );
            }
        }
    }
    return matrix[b.length][a.length];
}


export function sortSearchResults(items, query, getFieldVal) {
    if (!query) return items;
    const q = query.trim().toLowerCase();
    return [...items].sort((a, b) => {
        const valA = String(getFieldVal(a) || "").toLowerCase();
        const valB = String(getFieldVal(b) || "").toLowerCase();

        
        if (valA === q && valB !== q) return -1;
        if (valB === q && valA !== q) return 1;

        
        const startsA = valA.startsWith(q);
        const startsB = valB.startsWith(q);
        if (startsA && !startsB) return -1;
        if (startsB && !startsA) return 1;

        
        const incA = valA.includes(q);
        const incB = valB.includes(q);
        if (incA && !incB) return -1;
        if (incB && !incA) return 1;

        
        const distA = levenshteinDistance(valA, q);
        const distB = levenshteinDistance(valB, q);
        return distA - distB;
    });
}
