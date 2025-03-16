// دوال اللعبة الأساسية هنا مثل `createDeck()`, `shuffleDeck()`, `dealNextCards()`.
// تم تعديل قوانين أخرى مسبقًا هنا داخل ملف `rules.js`
function createDeck() {
    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ value, suit });
        });
    });
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}
