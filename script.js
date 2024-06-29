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
let numPlayers = 0;

function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const [value, points] of Object.entries(values)) {
            deck.push({ suit, value, points });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame(players) {
    numPlayers = players;
    document.getElementById('player-selection').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    document.getElementById('deal-button').style.display = 'block';

    for (let i = 1; i <= numPlayers; i++) {
        document.getElementById(`player${i}`).style.display = 'block';
    }
}

function dealCards() {
    const deck = createDeck();
    shuffleDeck(deck);

    for (let i = 1; i <= numPlayers; i++) {
        const hand = document.getElementById(`hand${i}`);
        hand.innerHTML = '';

        for (let j = 0; j < 3; j++) {
            const card = deck.pop();
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${getSuitSymbol(card.suit)}</div>`;
            hand.appendChild(cardElement);
        }
    }
}

function getSuitSymbol(suit) {
    switch (suit) {
        case 'Spades': return '♠';
        case 'Hearts': return '♥';
        case 'Diamonds': return '♦';
        case 'Clubs': return '♣';
        default: return '';
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}
