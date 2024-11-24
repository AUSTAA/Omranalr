document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const suitSymbols = { hearts: '♥', spades: '♠', diamonds: '♦', clubs: '♣' };
    const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
    let deck, player1Hand, player2Hand, middleCards, player1Collected, player2Collected;
    let currentPlayer = 1;
    let roundOver = false;

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
        currentPlayer = 1;
        roundOver = false;
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
        console.log('Middle cards distributed:', middleCards); // نقطة تفتيش
    }

    // تحديث العرض
    function updateDisplay() {
    renderCards('player1-hand', player1Hand, 1);
    renderCards('player2-hand', player2Hand, 2);
    renderCards('middle-cards', middleCards);

    // تحديث النقاط
    document.getElementById('player1-score').textContent = player1Collected.length;
    document.getElementById('player2-score').textContent = player2Collected.length;
}


    // عرض الأوراق
    function renderCards(containerId, cards, player) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
        `;
        cardElement.addEventListener('click', () => playCard(index, player)); // تمرير اللاعب الحالي
        container.appendChild(cardElement);
    });
}

    // لعب الورقة
    function playCard(cardIndex, player) {
    if (roundOver) return; // منع اللعب إذا انتهت الجولة

    // التأكد من أن الورقة التي يتم النقر عليها تخص اللاعب الحالي
    if ((currentPlayer === 1 && player !== 1) || (currentPlayer === 2 && player !== 2)) {
        alert("ليس دورك!");
        return;
    }

    const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
    const collectedCards = currentPlayer === 1 ? player1Collected : player2Collected;

    // التأكد أن الورقة التي تم اختيارها تخص اللاعب الحالي
    if (cardIndex < 0 || cardIndex >= currentHand.length) return;

    // الورقة التي يلعبها اللاعب
    const card = currentHand[cardIndex];
    const cardValue = cardValueToInt(card.value);

    // 1. التحقق من وجود ورقة مطابقة مباشرة في الوسط
    const matchingCardIndex = middleCards.findIndex(c => cardValueToInt(c.value) === cardValue);

    if (matchingCardIndex !== -1) {
        // إذا وُجدت ورقة مطابقة، يتم أخذها فقط
        collectedCards.push(middleCards.splice(matchingCardIndex, 1)[0]); // أخذ الورقة المطابقة
        collectedCards.push(card); // أخذ الورقة التي لعبها اللاعب
    } else {
        // 2. إذا لم تكن هناك ورقة مطابقة، نبحث عن مجموع مطابق
        const combinations = findSummingCombinations(middleCards, cardValue);

        if (combinations.length > 0) {
            // إذا وُجدت مجموعة مطابقة، يتم أخذ المجموعة
            combinations[0].forEach(match => {
                const index = middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                if (index !== -1) {
                    collectedCards.push(middleCards.splice(index, 1)[0]);
                }
            });
            collectedCards.push(card); // أخذ الورقة التي لعبها اللاعب
        } else {
            // إذا لم تكن هناك مطابقة مباشرة أو مجموع، تُضاف الورقة إلى الوسط
            middleCards.push(card);
        }
    }

    currentHand.splice(cardIndex, 1); // إزالة الورقة من يد اللاعب

    // إذا كانت أوراق الوسط فارغة بعد الحركة
    if (middleCards.length === 0) alert("شكبـّة!");

    // التحقق من نهاية الجولة
    if (player1Hand.length === 0 && player2Hand.length === 0) {
        dealNextCards(); // توزيع أوراق جديدة
    } else {
        // التبديل إلى اللاعب الآخر
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    // تحديث العرض بعد كل حركة
    updateDisplay();
}


    // توزيع أوراق جديدة
    function dealNextCards() {
        if (deck.length >= 6) {
            for (let i = 0; i < 3; i++) {
                player1Hand.push(deck.pop());
                player2Hand.push(deck.pop());
            }
        } else {
            endRound();
        }
    }

    // إنهاء الجولة
    function endRound() {
        roundOver = true;
        const player1Score = player1Collected.length;
        const player2Score = player2Collected.length;

        alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);

        if (player1Score > player2Score) {
            currentPlayer = 1;
        } else {
            currentPlayer = 2;
        }

        initializeGame();
    }

    // قيمة الورقة كرقم
    function cardValueToInt(value) {
        switch (value) {
            case 'A': return 1;
            case 'Q': return 8;
            case 'J': return 9;
            case 'K': return 10;
            default: return parseInt(value);
        }
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
    document.getElementById('start-game').addEventListener('click', initializeGame);
    initializeGame();
});
