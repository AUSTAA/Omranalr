// deck.js
const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];

export function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

export function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}
