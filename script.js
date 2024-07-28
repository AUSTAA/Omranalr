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

    javascriptfunction playCard(event, playerHand, playerCollected, playerRevealed, middleCards) { const cardElement = event.target.closest('.card'); if (!cardElement) return; const cardValue = cardElement.querySelector('.top-left').textContent[0]; const cardSuit = cardElement.classList[1]; const card = { value: cardValue, suit: cardSuit }; // Find and remove the card from the player's hand const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit); if (cardIndex === -1) return; playerHand.splice(cardIndex,1); // Find matching cards in the middle const matchingCards = middleCards.filter(c => c.value === card.value); // New: Display potential picks to the player if there are matching cards if (matchingCards.length >0) { alert(`الأوراق المتاحة للاختيار: \n${matchingCards.map(mc => `${mc.value} of ${mc.suit}`).join('\n')}`); } else { // Otherwise, find summing cards const cardValueInt = cardValueToInt(card.value); chosenCards = findSummingCards(middleCards, cardValueInt); } // Display collected cards before flipping playerCollected.push(card); // Add the played card to collected cards displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed); let isShkeba = false; if (chosenCards.length >0) { // Allow the player to take all matching or summing cards chosenCards.forEach(mc => { const index = middleCards.findIndex(c => c.value === mc.value && c.suit === mc.suit); if (index > -1) middleCards.splice(index,1); playerCollected.push(mc); // Add middle card to collected cards }); // Check if the player took the last card(s) from the middle if (middleCards.length ===0) { isShkeba = true; playerRevealed.push(card); // Add the played card to revealed cards lastPlayerToTake = currentPlayer; } // Display updated collected cards displayCollectedCards(`player${currentPlayer}-collected`, playerCollected, playerRevealed); } else { // If no matching or summing cards, put the played card in the middle middleCards.push(card); } // Display updated middle cards displayCards('middle-cards-container', middleCards); // Switch turn to the other player currentPlayer = currentPlayer ===1 ?2 :1; // Display updated hands displayCards('player1-cards', player1Hand); displayCards('player2-cards', player2Hand); // Deal new cards if both players are out of cards if (player1Hand.length ===0 && player2Hand.length ===0 && deck.length >0) { dealNewCards(); displayCards('player1-cards', player1Hand); displayCards('player2-cards', player2Hand); } // Show "شكبـّة" message if it is a shkeba if (isShkeba) { alert('شكبـّة'); } // Check for end of round if (player1Hand.length ===0 && player2Hand.length ===0 && deck.length ===0) { endRound(); }}

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
        return result.length > 0 ? result[0] : [];
    }

    function endRound() {
        calculateScores();
        updateScores();

        if (player1Score >= 61 || player2Score >= 61) {
            if (player1Score === player2Score) {
                // Both players reached the same score
                alert("Both players have reached 61 points! Continuing to 71 points...");
            } else {
                declareWinner();
                return;
            }
        }

        if (player1Score >= 71 || player2Score >= 71) {
            if (player1Score === player2Score) {
                alert("Both players have reached 71 points! Continuing to 81 points...");
            } else {
                declareWinner();
                return;
            }
        }

        // Reset for a new round
        deck = createDeck();
        deck = shuffleDeck(deck);
        player1Hand.length = 0;
        player2Hand.length = 0;
        middleCards.length = 0;
        player1Collected.length = 0;
        player2Collected.length = 0;
        player1Revealed.length = 0;
        player2Revealed.length = 0;
        dealInitialCards();

        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);
        displayCards('middle-cards-container', middleCards);
        displayCollectedCards('player1-collected', player1Collected, player1Revealed);
        displayCollectedCards('player2-collected', player2Collected, player2Revealed);

        document.getElementById('round-message').style.display = 'block';
        setTimeout(() => {
            document.getElementById('round-message').style.display = 'none';
        }, 2000);
    }

    function calculateScores() {
        let player1Points = 0;
        let player2Points = 0;

        player1Points += player1Collected.length > player2Collected.length ? 1 : 0;
        player2Points += player2Collected.length > player1Collected.length ? 1 : 0;

        const player1Diamonds = player1Collected.filter(card => card.suit === 'diamonds').length;
        const player2Diamonds = player2Collected.filter(card => card.suit === 'diamonds').length;

        player1Points += player1Diamonds > player2Diamonds ? 1 : 0;
        player2Points += player2Diamonds > player1Diamonds ? 1 : 0;

        if (player1Collected.some(card => card.value === '7' && card.suit === 'diamonds')) player1Points += 1;
        if (player2Collected.some(card => card.value === '7' && card.suit === 'diamonds')) player2Points += 1;

        if (player1Collected.filter(card => card.value === '7').length >= 3) player1Points += 1;
        if (player2Collected.filter(card => card.value === '7').length >= 3) player2Points += 1;

        if (player1Collected.filter(card => card.value === '7').length >= 2 && player1Collected.filter(card => card.value === '6').length >= 3) player1Points += 1;
        if (player2Collected.filter(card => card.value === '7').length >= 2 && player2Collected.filter(card => card.value === '6').length >= 3) player2Points += 1;

        if (player1Diamonds >= 8) {
player1Points += 10;
player2Points = 0;
}

    if (player2Diamonds >= 8) {
        player2Points += 10;
        player1Points = 0;
    }

    if (player1Diamonds >= 9 && player2Diamonds === 1) {
        player1Points += player1Points;
        player2Points = 0;
    }

    if (player2Diamonds >= 9 && player1Diamonds === 1) {
        player2Points += player2Points;
        player1Points = 0;
    }

    if (player1Diamonds === 10) {
        player1Points += player1Points;
        alert("Player 1 wins with a perfect 10 diamonds!");
        player2Points = 0;
        player1Score += player1Points;
        player2Score += player2Points;
        declareWinner();
        return;
    }

    if (player2Diamonds === 10) {
        player2Points += player2Points;
        alert("Player 2 wins with a perfect 10 diamonds!");
        player1Points = 0;
        player1Score += player1Points;
        player2Score += player2Points;
        declareWinner();
        return;
    }

    player1Collected.forEach(card => {
        if (card.value === '7') player1Points += 7;
    });

    player2Collected.forEach(card => {
        if (card.value === '7') player2Points += 7;
    });

    player1Score += player1Points;
    player2Score += player2Points;
}

function updateScores() {
    document.getElementById('player1-score').textContent = `Score: ${player1Score}`;
    document.getElementById('player2-score').textContent = `Score: ${player2Score}`;
}

function declareWinner() {
    const winner = player1Score > player2Score ? 'Player 1' : 'Player 2';
    alert(`${winner} wins the game with ${Math.max(player1Score, player2Score)} points!`);
    resetGame();
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    endRound();
}

});
