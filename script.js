const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
let players = [];
let centerCards = [];
let currentPlayer = 0;
let scores = [];

function startGame(numPlayers) {
    const game = document.getElementById('game');
    const playerSelection = document.getElementById('player-selection');

    playerSelection.style.display = 'none';
    game.style.display = 'flex';

    players = Array.from({ length: numPlayers }, () => []);
    scores = Array(numPlayers).fill(0);
    dealCenterCards();
    dealPlayerCards();
}

function dealCenterCards() {
    centerCards = [];
    const center = document.getElementById('center-cards');
    center.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const card = drawCard();
        centerCards.push(card);
        center.appendChild(createCardElement(card));
    }
}

function dealPlayerCards() {
    players.forEach(player => {
        for (let i = 0; i < 3; i++) {
            const card = drawCard();
            player.push(card);
        }
    });
    updateHands();
}

function drawCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    const points = getCardPoints(value);
    return { suit, value, points };
}

function getCardPoints(value) {
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

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${card.suit}</div>`;
    return cardElement;
}

function updateHands() {
    const playerElements = document.querySelectorAll('.player .hand');
    if (!playerElements) {
        console.error('No player elements found');
        return;
    }

    playerElements.forEach((hand, index) => {
        if (players[index]) {
            hand.innerHTML = '';
            players[index].forEach(card => {
                const cardElement = createCardElement(card);
                cardElement.onclick = () => {
                    if (currentPlayer === index) {
                        playCard(cardElement, card, index);
                    }
                };
                hand.appendChild(cardElement);
            });
        } else {
            console.error(`No player data found for index ${index}`);
        }
    });
}

function playCard(cardElement, card, playerIndex) {
    const matchingCards = centerCards.filter(centerCard => card.points === centerCard.points);
    const sumOptions = getSumOptions(card.points, centerCards);

    if (matchingCards.length > 0) {
        showOptions(card, matchingCards, playerIndex, cardElement);
    } else if (sumOptions.length > 0) {
        showOptions(card, sumOptions, playerIndex, cardElement);
    } else {
        centerCards.push(card);
        document.getElementById('center-cards').appendChild(cardElement);
        endTurn();
    }
}

function getSumOptions(target, cards) {
    let results = [];
    function findSum(current, remaining, target) {
        if (target === 0) {
            results.push(current);
            return;
        }
        if (target < 0 || remaining.length === 0) return;
        findSum([...current, remaining[0]], remaining.slice(1), target - remaining[0].points);
        findSum(current, remaining.slice(1), target);
    }
    findSum([], cards, target);
    return results;
}

function showOptions(card, options, playerIndex, cardElement) {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    options.forEach(option => {
        const optionElement = document.createElement('div');
        option.forEach(c => optionElement.appendChild(createCardElement(c)));
        optionElement.classList.add('option');
        optionElement.onclick = () => {
            collectCards(card, option, playerIndex, cardElement);
        };
        optionsContainer.appendChild(optionElement);
    });

    document.body.appendChild(optionsContainer);
}

function collectCards(card, selectedCards, playerIndex, cardElement) {
    players[playerIndex] = players[playerIndex].filter(c => c !== card);
    centerCards = centerCards.filter(c => !selectedCards.includes(c));

    cardElement.remove();
    selectedCards.forEach(c => document.querySelector(`#center-cards .card[data-value="${c.value}"][data-suit="${c.suit}"]`).remove());

    const collectedStack = document.createElement('div');
    collectedStack.classList.add('collected-stack');
    collectedStack.appendChild(createCardElement(card));
    selectedCards.forEach(c => collectedStack.appendChild(createCardElement(c)));
    document.querySelector(`.player:nth-child(${playerIndex + 1}) .hand`).appendChild(collectedStack);

    scores[playerIndex] += card.points + selectedCards.reduce((acc, c) => acc + c.points, 0);

    endTurn();
}

function endTurn() {
    document.querySelector('.options-container')?.remove();
    currentPlayer = (currentPlayer + 1) % players.length;
    if (players.every(player => player.length === 0)) {
        endRound();
    } else {
        updateHands();
    }
}

function endRound() {
    const minScore = Math.min(...scores);
    const dealerIndex = scores.indexOf(minScore);
    currentPlayer = dealerIndex;
    document.getElementById('deal-button').style.display = 'block';
}

function dealCards() {
    if (players.every(player => player.length === 0)) {
        dealCenterCards();
        dealPlayerCards();
        document.getElementById('deal-button').style.display = 'none';
    }
}

// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Omranalr/sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}
