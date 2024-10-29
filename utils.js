// utils.js
export function cardValueToInt(value) {
    switch (value) {
        case 'A': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case 'Q': return 8;
        case 'J': return 9;
        case 'K': return 10;
        default: return 0;
    }
}

export function findAllSummingCombinations(cards, targetValue) {
    const results = [];

    function findCombination(currentCombination, remainingCards, currentSum) {
        if (currentSum === targetValue) {
            results.push([...currentCombination]);
            return;
        }
        if (currentSum > targetValue || remainingCards.length === 0) return;

        for (let i = 0; i < remainingCards.length; i++) {
            findCombination(
                [...currentCombination, remainingCards[i]],
                remainingCards.slice(i + 1),
                currentSum + cardValueToInt(remainingCards[i].value)
            );
        }
    }

    findCombination([], cards, 0);
    return results;
}
