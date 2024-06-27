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
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// توزيع الأوراق
function dealCards() {
    const deck = createDeck();
    shuffleDeck(deck);

    const players = ['player1', 'player2', 'player3', 'player4'];
    let cardIndex = 0;

    for (const player of players) {
        const hand = document.getElementById(`hand${player.slice(-1)}`);
        hand.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const card = deck[cardIndex++];
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${getSuitSymbol(card.suit)}</div>`;
            hand.appendChild(cardElement);
        }
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

// تسجيل الـ Service Worker لتحويل التطبيق إلى PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}
