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
    let player1Score = 0;
    let player2Score = 0;

    // Initialize hands and middle cards
    dealInitialCards();

    // Display cards
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected, player1Revealed);
    displayCollectedCards('player2-collected', player2Collected, player2Revealed);
    updateScores();

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

    function displayCollectedCards(elementId, cards, revealedCards) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card collected-card';
            cardElement.style.top = `${index * 2}px`;
            cardElement.style.left = `${index * 2}px`;
            container.appendChild(cardElement);
        });

        // Display revealed cards (partial)
        revealedCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.suit} revealed-card`;
            cardElement.innerHTML = `
                <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
                <div class="symbol">${suitSymbols[card.suit]}</div>
                <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
            `;
            cardElement.style.top = `${index * 2}px`;
            cardElement.style.left = `${index * 2}px`;
            cardElement.style.opacity = '0.5'; // Make it partially visible
            container.appendChild(cardElement);
        });
    }

    function playCard(event, playerHand, playerCollected, playerRevealed, middleCards) {
        const cardElement = event.target.closest('.card');
        if (!cardElement) return;

        const cardValue = cardElement.querySelector('.top-left').textContent[0];
        const cardSuit = cardElement.classList[1];
        const card = { value: cardValue, suit: cardSuit };

        // Find and remove the card from the player's hand
        const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit);
        if (cardIndex === -1) return;
        playerHand.splice(cardIndex, 1);

        // Find matching cards in the middle
        const matchingCards = middleCards.filter(c => c.value === card.value);
        const cardValueInt = cardValueToInt(card.value);

        let chosenCards = [];
        if (matchingCards.length > 0) {
            // If there are matching cards, choose them
            chosenCards = matchingCards;
        } else {
            // Otherwise, find summing cards
            chosenCards = findSummingCards(middleCards, cardValueInt);
        }

        if (chosenCards.length > 0 && chosenCards[0].length > 1) {
            // If there are multiple sets of cards that sum to the card value, let the player choose
            showChoices(chosenCards, chosenSet => {
                collectCards(playerCollected, playerRevealed, chosenSet, card);
            });
        } else if (chosenCards.length > 0) {
            // Otherwise, just collect the cards
            collectCards(playerCollected, playerRevealed, chosenCards[0], card);
        } else {
            // If no matching or summing cards, put the played card in the middle
            middleCards.push(card);
            displayCards('middle-cards-container', middleCards);
            switchTurn();
        }

        // Display updated hands
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);

        // Deal new cards if both players are out of cards
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealNewCards();
            displayCards('player1-cards', player1Hand);
            displayCards('player2-cards', player2Hand);
        }

        // Check for end of round
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length === 0) {
            endRound();
        }
    }

    function showChoices(choices, callback) {
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container';

        choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = `Option ${index + 1}`;
            choiceButton.addEventListener('click', () => {
                document.body.removeChild(choicesContainer);
                callback(choice);
            });
            choicesContainer.appendChild(choiceButton);
        });

        document.body.appendChild(choicesContainer);
    }

    function collectCards(playerCollected, playerRevealed, chosenCards, playedCard) {
        chosenCards.forEach(mc => {
            const index = middleCards.findIndex(c => c.value === mc.value && c.suit === mc.suit);
            if (index > -1) middleCards.splice(index, 1);
            playerCollected.push(mc); // Add middle card to collected cards
        });

        // Add the played card to the player's collected cards
        playerCollected.push(playedCard);

             // Check if the player took the last card(s) from the middle
        let isShkeba = false;
        if (middleCards.length === 0) {
            isShkeba = true;
            playerRevealed.push(playedCard);  // Add the played card to revealed cards
            lastPlayerToTake = currentPlayer;
        }

        // Display updated collected cards
        displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed);
        displayCards('middle-cards-container', middleCards);

        // Show "شكبـّة" message if it is a shkeba
        if (isShkeba) {
            alert('شكبـّة');
        }

        // Switch turn to the other player
        switchTurn();
    }

    function switchTurn() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateScores();
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
                result.push([...currentCombination]);
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

    function endRound() {
        // Calculate final scores
        if (lastPlayerToTake === 1) {
            player1Collected.push(...middleCards);
        } else if (lastPlayerToTake === 2) {
            player2Collected.push(...middleCards);
        }

        const player1CardsValue = calculateCardsValue(player1Collected);
        const player2CardsValue = calculateCardsValue(player2Collected);

        player1Score += player1CardsValue;
        player2Score += player2CardsValue;

        // Display scores and end round message
        updateScores();
        displayEndRoundMessage();

        // Reset game for next round
        resetGame();
    }

    function calculateCardsValue(cards) {
        let value = 0;
        cards.forEach(card => {
            value += cardValueToInt(card.value);
        });
        return value;
    }

    function updateScores() {
        document.getElementById('player1-score').textContent = `Score: ${player1Score}`;
        document.getElementById('player2-score').textContent = `Score: ${player2Score}`;
    }

    function displayEndRoundMessage() {
        const messageElement = document.createElement('div');
        messageElement.className = 'round-message';
        if (player1Score > player2Score) {
            messageElement.textContent = 'Player 1 wins this round!';
        } else if (player2Score > player1Score) {
            messageElement.textContent = 'Player 2 wins this round!';
        } else {
            messageElement.textContent = 'It\'s a tie!';
        }
        document.body.appendChild(messageElement);
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 3000);
    }

    
    function resetGame() {
        deck = createDeck();
        deck = shuffleDeck(deck);
        player1Hand.length = 0;
        player2Hand.length = 0;
        middleCards.length = 0;
        player1Collected.length = 0;
        player2Collected.length = 0;
        player1Revealed.length = 0;
        player2Revealed.length = 0;
        currentPlayer = 1;
        lastPlayerToTake = null;

        // Deal initial cards
        dealInitialCards();

        // Display cards
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);
        displayCards('middle-cards-container', middleCards);
        displayCollectedCards('player1-collected', player1Collected, player1Revealed);
        displayCollectedCards('player2-collected', player2Collected, player2Revealed);
        updateScores();
    }

    function showChoices(choices, callback) {
        const choicesContainer = document.createElement('div');
        choicesContainer.className = 'choices-container';

        choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = `Choice ${index + 1}`;
            choiceButton.addEventListener('click', () => {
                callback(choice);
                document.body.removeChild(choicesContainer);
            });
            choicesContainer.appendChild(choiceButton);
        });

        document.body.appendChild(choicesContainer);
    }

    function playCard(event, playerHand, playerCollected, playerRevealed, middleCards) {
        const cardElement = event.target.closest('.card');
        if (!cardElement) return;

        const cardValue = cardElement.querySelector('.top-left').textContent[0];
        const cardSuit = cardElement.classList[1];
        const playedCard = { value: cardValue, suit: cardSuit };

        // Find and remove the card from the player's hand
        const cardIndex = playerHand.findIndex(c => c.value === playedCard.value && c.suit === playedCard.suit);
        if (cardIndex === -1) return;
        playerHand.splice(cardIndex, 1);

        // Find matching cards in the middle
        const matchingCards = middleCards.filter(c => c.value === playedCard.value);
        const cardValueInt = cardValueToInt(playedCard.value);

        if (matchingCards.length > 0) {
            // If there are matching cards, choose them
            collectCards([playedCard, ...matchingCards], playerCollected, playerRevealed, middleCards);
        } else {
            // Otherwise, find summing cards
            const summingCards = findSummingCards(middleCards, cardValueInt);

            if (summingCards.length > 1) {
                // If multiple options, show choices to the player
                showChoices(summingCards, chosenCards => {
                    collectCards([playedCard, ...chosenCards], playerCollected, playerRevealed, middleCards);
                });
            } else if (summingCards.length === 1) {
                collectCards([playedCard, ...summingCards[0]], playerCollected, playerRevealed, middleCards);
            } else {
                // If no matching or summing cards, put the played card in the middle
                middleCards.push(playedCard);
                displayCards('middle-cards-container', middleCards);
                switchTurn();
            }
        }

        // Display updated hands
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);

        // Deal new cards if both players are out of cards
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length > 0) {
            dealNewCards();
            displayCards('player1-cards', player1Hand);
            displayCards('player2-cards', player2Hand);
        }

        // Check for end of round
        if (player1Hand.length === 0 && player2Hand.length === 0 && deck.length === 0) {
            endRound();
        }
    }

    function collectCards(cards, playerCollected, playerRevealed, middleCards) {
        let isShkeba = false;

        cards.forEach(card => {
            const index = middleCards.findIndex(c => c.value === card.value && c.suit === card.suit);
            if (index > -1) {
                middleCards.splice(index, 1);
                playerCollected.push(card); // Add middle card to collected cards
            } else {
                playerCollected.push(card); // Add the played card to collected cards
            }
        });

        // Check if the player took the last card(s) from the middle
        if (middleCards.length === 0) {
            isShkeba = true;
            playerRevealed.push(cards[0]);  // Add the played card to revealed cards
            lastPlayerToTake = currentPlayer;
        }

        // Display updated collected cards
        displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed);
        displayCards('middle-cards-container', middleCards);

        // Show "شكبـّة" message if it is a shkeba
        if (isShkeba) {
            alert('شكبـّة');
        }

        // Switch turn to the other player
        switchTurn();
    }
});
