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
    displayCollectedCards('player1-collected', player1Collected, player1Revealed, 'player1-shkeba-count');
    displayCollectedCards('player2-collected', player2Collected, player2Revealed, 'player2-shkeba-count');

    // Event listeners for playing cards
    document.getElementById('player1-cards').addEventListener('click', event => {
        if (currentPlayer === 1) playCard(event, player1Hand, player1Collected, player1Revealed, middleCards, 'player1-shkeba-count');
    });
    document.getElementById('player2-cards').addEventListener('click', event => {
        if (currentPlayer === 2) playCard(event, player2Hand, player2Collected, player2Revealed, middleCards, 'player2-shkeba-count');
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

    function displayCollectedCards(elementId, cards, revealedCards, shkebaCountId) {
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
        const revealedContainer = document.querySelector(`#${elementId} ~ .revealed-container .revealed-card`);
        revealedContainer.innerHTML = '';
        revealedCards.forEach((card, index) => {
            if (index === revealedCards.length - 1) { // آخر ورقة مكشوفة جزئياً
                revealedContainer.className = `card ${card.suit} revealed-card`;
                revealedContainer.innerHTML = `
                    <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
                    <div class="symbol">${suitSymbols[card.suit]}</div>
                    <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
                `;
            }
        });

        // تحديث عداد الشكبة
        const shkebaCountElement = document.getElementById(shkebaCountId);
        shkebaCountElement.innerText = cards.length;
    }

    function playCard(event, hand, collected, revealed, middleCards, shkebaCountId) {
        const cardElement = event.target.closest('.card');
        if (!cardElement) return;

        const cardIndex = Array.from(cardElement.parentElement.children).indexOf(cardElement);
        const playedCard = hand.splice(cardIndex, 1)[0];

        // تحقق من إمكانية أخذ أوراق من الوسط
        const matchingIndex = middleCards.findIndex(card => card.value === playedCard.value);
        if (matchingIndex !== -1) {
            collected.push(...middleCards.splice(matchingIndex, 1));
            lastPlayerToTake = currentPlayer;
        }

        // أضف البطاقة التي تم لعبها إلى الوسط
        middleCards.push(playedCard);

        // تغيير الدور إلى اللاعب الآخر
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        // تحديث العرض
        displayCards('player1-cards', player1Hand);
        displayCards('player2-cards', player2Hand);
        displayCards('middle-cards-container', middleCards);
        displayCollectedCards('player1-collected', player1Collected, player1Revealed, 'player1-shkeba-count');
        displayCollectedCards
