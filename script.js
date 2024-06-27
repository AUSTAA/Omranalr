// script.js

const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const values = {
    'A': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    'Q': 8,
    'J': 9,
    'K': 10
};

// إنشاء مجموعة الأوراق
function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const [value, points] of Object.entries(values)) {
            deck.push({ suit, value, points });
        }
    }
    return deck;
}

// خلط الأوراق
function shuffleDeck() {
    const deck = createDeck();
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    displayDeck(deck);
}

// عرض الأوراق
function displayDeck(deck) {
    const deckContainer = document.getElementById('deck');
    deckContainer.innerHTML = '';
    for (const card of deck) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${getSuitSymbol(card.suit)}</div>`;
        deckContainer.appendChild(cardElement);
    }
}

// إرجاع رمز الشكل
function getSuitSymbol(suit) {
    switch (suit) {
        case 'Spades': return '♠';
        case 'Hearts': return '♥';
        case 'Diamonds': return '♦';
        case 'Clubs': return '♣';
        default: return '';
    }
}

// شغل الأوراق عند بدء التحميل
window.onload = () => {
    shuffleDeck();
};
