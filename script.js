document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const suitSymbols = {
        hearts: '♥',
        spades: '♠',
        diamonds: '♦',
        clubs: '♣'
    };
    const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
    let deck = createDeck();
    deck = shuffleDeck(deck);

    const player1Hand = [];
    const player2Hand = [];
    const middleCards = [];
    const player1Collected = [];
    const player2Collected = [];
    const player1Revealed = [];
    const player2Revealed = [];

    let currentPlayer = 1;
    let lastPlayerToTake = null;

    // Initialize hands and middle cards
    dealInitialCards();

    // Display cards
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected);
    displayCollectedCards('player2-collected', player2Collected);

    // Event listeners for playing cards
    document.getElementById('player1-cards').addEventListener('click', event => {
        if (currentPlayer === 1) playCard(event, player1Hand, player1Collected, player1Revealed, middleCards);
    });
    document.getElementById('player2-cards').addEventListener('click', event => {
        if (currentPlayer === 2) playCard(event, player2Hand, player2Collected, player2Revealed, middleCards);
    });

    function createDeck() {
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
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

    function dealNewCards() {
        for (let i = 0; i < 3; i++) {
            if (deck.length > 0) player1Hand.push(deck.pop());
            if (deck.length > 0) player2Hand.push(deck.pop());
        }
    }

    function displayCards(elementId, cards) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit}`;
            cardElement.innerHTML = `
                <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
                <div class="symbol">${suitSymbols[card.suit]}</div>
                <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
            `;
            container.appendChild(cardElement);
        });
    }

    function displayCollectedCards(elementId, cards) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card collected-card';
            cardElement.style.top = `${index * 2}px`;
            cardElement.style.left = `${index * 2}px`;
            container.appendChild(cardElement);
        });
    }

    function animateCardToPlayer(cardElement, playerCollectedContainer, isRevealed = false) {
        const cardClone = cardElement.cloneNode(true);
        cardClone.style.position = 'absolute';
        cardClone.style.zIndex = 1000;
        document.body.appendChild(cardClone);

        const rect = cardElement.getBoundingClientRect();
        cardClone.style.left = `${rect.left}px`;
        cardClone.style.top = `${rect.top}px`;

        const targetRect = playerCollectedContainer.getBoundingClientRect();
        const targetLeft = targetRect.left + (targetRect.width / 2) - (cardClone.offsetWidth / 2);
        const targetTop = targetRect.top + (targetRect.height / 2) - (cardClone.offsetHeight / 2);

        cardClone.style.transition = 'all 0.5s ease-in-out';
        cardClone.style.left = `${targetLeft}px`;
        cardClone.style.top = `${targetTop}px`;

        setTimeout(() => {
            document.body.removeChild(cardClone);
            if (isRevealed) {
                cardElement.classList.add('revealed');
                playerCollectedContainer.appendChild(cardElement);
            } else {
                playerCollectedContainer.appendChild(cardElement);
            }
        }, 500);
    }

    function showTakenCards(cards) {
        const message = `Player took ${cards.length} card(s): ${cards.map(card => card.innerText).join(', ')}`;
        alert(message);
    }

    function playCard(event, playerHand, playerCollected, playerRevealed, middleCards) {
        const cardElement = event.target.closest('.card');
        if (!cardElement) return;

        const cardValue = cardElement.querySelector('.top-left').textContent[0];
        const cardSuit = cardElement.classList[1];
        const card = { value: cardValue, suit: cardSuit };

        const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit);
        if (cardIndex === -1) return;
        playerHand.splice(cardIndex, 1);

        let matchingCards = middleCards.filter(c => c.value === card.value);
        if (matchingCards.length === 0) {
            const cardValueInt = cardValueToInt(card.value);
            matchingCards = findSummingCards(middleCards, cardValueInt);
        }

        if (matchingCards.length > 0) {
            const chosenCards = chooseCards(matchingCards, card);

            chosenCards.forEach(mc => {
                const index = middleCards.findIndex(c => c.value === mc.value && c.suit === mc.suit);
                if (index > -1) middleCards.splice(index, 1);
                playerCollected.push(mc);
            });

            playerCollected.push(card);
            showTakenCards([card, ...chosenCards]);
            chosenCards.forEach(mc => animateCardToPlayer(document.querySelector(`.middle-container .${mc.suit}`), document.getElementById(`player${currentPlayer}-collected`)));
            animateCardToPlayer(cardElement, document.getElementById(`player${currentPlayer}-collected`));
            lastPlayerToTake = currentPlayer;

            displayCollectedCards(`player${currentPlayer}-collected`, playerCollected);
        } else {
            middleCards.push(card);
            animateCardToPlayer(cardElement, document.getElementById('middle-cards-container'));
        }

        displayCards('middle-cards-container', middleCards);

        currentPlayer = currentPlayer === 1 ? 2 : 1;

        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);

        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealNewCards();
            displayCards('player1-cards', player1Hand);
            displayCards('player2-cards', player2Hand);
        }

        if (deck.length === 0 && middleCards.length === 0 && lastPlayerToTake !== null) {
            const lastPlayerCollected = lastPlayerToTake === 1 ? player1Collected : player2Collected;
            playerRevealed.push(card);
            displayCollectedCards(`player${lastPlayerToTake}-collected`, lastPlayerCollected);
        }
    }

    function cardValueToInt(value) {
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

    function findSummingCards(cards, targetValue) {
        const result = [];
        function findCombination(currentCombination, remainingCards, currentSum) {
            if (currentSum === targetValue) {
                result.push(...currentCombination);
                return;
            }
            if (currentSum > targetValue || remainingCards.length === 0) return;

            for (let i = 0; i < remainingCards.length; i++) {

                            findCombination([...currentCombination, remainingCards[i]], remainingCards.slice(i + 1), currentSum + cardValueToInt(remainingCards[i].value));
            }
        }

        findCombination([], cards, 0);
        return result;
    }

    function chooseCards(matchingCards, playedCard) {
        // For simplicity, returning the first set found
        // In a real game, you would prompt the player to choose
        return matchingCards.slice(0, 1);
    }
});
