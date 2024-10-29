// game.js
import { createDeck, shuffleDeck } from './deck.js';
import { displayCards, displayCollectedCards } from './ui.js';
import { cardValueToInt, findAllSummingCombinations } from './utils.js';

let deck = shuffleDeck(createDeck());
const player1Hand = [];
const player2Hand = [];
const middleCards = [];
const player1Collected = [];
const player2Collected = [];
let currentPlayer = 1;

export function startGame() {
    dealInitialCards();
    updateUI();
}

function dealInitialCards() {
    for (let i = 0; i < 3; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        middleCards.push(deck.pop());
    }
}

export function playCard(event, playerHand, playerCollected) {
    const cardElement = event.target.closest('.card');
    if (!cardElement) return;

    const cardValue = cardElement.querySelector('.top-left').textContent[0];
    const cardSuit = cardElement.classList[1];
    const card = { value: cardValue, suit: cardSuit };

    const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit);
    if (cardIndex === -1) return;
    playerHand.splice(cardIndex, 1);

    const matchingCard = middleCards.find(c => c.value === card.value && c.suit === card.suit);

    if (matchingCard) {
        collectCards([matchingCard], card, playerCollected);
    } else {
        const cardValueInt = cardValueToInt(card.value);
        const possibleCombinations = findAllSummingCombinations(middleCards, cardValueInt);

        if (possibleCombinations.length > 0) {
            showCombinationOptions(possibleCombinations, card, playerCollected);
        } else {
            middleCards.push(card);
        }
    }

    updateUI();
    switchTurn();
}

function collectCards(selectedCards, playedCard, playerCollected) {
    selectedCards.forEach(card => {
        const index = middleCards.findIndex(c => c.value === card.value && c.suit === card.suit);
        if (index > -1) middleCards.splice(index, 1);
    });

    playerCollected.push(...selectedCards, playedCard);
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('round-message').textContent = `دور اللاعب ${currentPlayer}`;
}

function updateUI() {
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected);
    displayCollectedCards('player2-collected', player2Collected);
}
