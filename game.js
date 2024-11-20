document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const suitSymbols = { hearts: '♥', spades: '♠', diamonds: '♦', clubs: '♣' };
    const values = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
    let deck, player1Hand, player2Hand, middleCards, player1Collected, player2Collected;
    let currentPlayer = 1, lastPlayerToTake = null;

    // تهيئة اللعبة
    function initializeGame() {
        deck = createDeck();
        shuffleDeck(deck);
        player1Hand = [];
        player2Hand = [];
        middleCards = [];
        player1Collected = [];
        player2Collected = [];
        dealInitialCards();
        updateDisplay();
    }

    // إنشاء مجموعة الأوراق
    function createDeck() {
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
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

    // توزيع الأوراق الأولية
    function dealInitialCards() {
        for (let i = 0; i < 3; i++) {
            player1Hand.push(deck.pop());
            player2Hand.push(deck.pop());
        }
        for (let i = 0; i < 4; i++) {
            middleCards.push(deck.pop());
        }
    }

    // تحديث العرض
    function updateDisplay() {
        renderCards('player1-hand', player1Hand);
        renderCards('player2-hand', player2Hand);
        renderCards('middle-cards', middleCards);
    }

    // عرض الأوراق
    function renderCards(containerId, cards) {
        const container = document.getElementById(containerId);
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

    // قيمة الورقة كرقم
    function cardValueToInt(value) {
        switch (value) {
            case 'A': return 1;
            case 'J': return 9;
            case 'Q': return 8;
            case 'K': return 10;
            default: return parseInt(value);
        }
    }

    // لعب الورقة
    function playCard(card, playerHand, collectedCards) {
        const cardValue = cardValueToInt(card.value);
        const combinations = findSummingCombinations(middleCards, cardValue);

        if (combinations.length > 0) {
            combinations[0].forEach(match => {
                const index = middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                if (index !== -1) {
                    middleCards.splice(index, 1);
                    collectedCards.push(match);
                }
            });
            collectedCards.push(card);
        } else {
            middleCards.push(card);
        }

        const cardIndex = playerHand.indexOf(card);
        if (cardIndex !== -1) playerHand.splice(cardIndex, 1);

        if (middleCards.length === 0) alert("شكبـّة!");
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateDisplay();
    }

    // إيجاد كل التركيبات الممكنة
    function findSummingCombinations(cards, targetValue) {
        const results = [];
        function search(current, remaining, sum) {
            if (sum === targetValue) {
                results.push(current);
                return;
            }
            if (sum > targetValue || remaining.length === 0) return;
            for (let i = 0; i < remaining.length; i++) {
                search([...current, remaining[i]], remaining.slice(i + 1), sum + cardValueToInt(remaining[i].value));
            }
        }
        search([], cards, 0);
        return results;
    }

    // بدء اللعبة
    initializeGame();
});
