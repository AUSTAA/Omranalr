document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const suitSymbols = { hearts: '♥', spades: '♠', diamonds: '♦', clubs: '♣' };
    const values = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
    let deck, player1Hand, player2Hand, middleCards, player1Collected, player2Collected;
    let currentPlayer = 1;
    let roundOver = false;
    let player1Score = 0;
    let player2Score = 0;
    let player1DinariCount = 0;
    let player2DinariCount = 0;
    let player1SevenCount = 0;
    let player2SevenCount = 0;

    // تهيئة اللعبة
    function initializeGame() {
        deck = createDeck();
        shuffleDeck(deck);
        player1Hand = [];
        player2Hand = [];
        middleCards = [];
        player1Collected = [];
        player2Collected = [];
        player1Score = 0;
        player2Score = 0;
        player1DinariCount = 0;
        player2DinariCount = 0;
        player1SevenCount = 0;
        player2SevenCount = 0;
        dealInitialCards();
        currentPlayer = player1Score > player2Score ? 1 : 2; // اللاعب ذو النقاط الأعلى يبدأ
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
    }

    // تحديث العرض
    function updateDisplay() {
        renderCards('player1-hand', player1Hand, 1);
        renderCards('player2-hand', player2Hand, 2);
        renderCards('middle-cards', middleCards);
        // تحديث النقاط
        document.getElementById('player1-score').textContent = player1Score;
        document.getElementById('player2-score').textContent = player2Score;
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
            cardElement.addEventListener('click', () => playCard(index, player)); 
            container.appendChild(cardElement);
        });
    }

    // لعب الورقة
    function playCard(cardIndex, player) {
        if (roundOver) return; // منع اللعب إذا انتهت الجولة
        if ((currentPlayer === 1 && player !== 1) || (currentPlayer === 2 && player !== 2)) {
            alert("ليس دورك!");
            return;
        }

        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const collectedCards = currentPlayer === 1 ? player1Collected : player2Collected;

        if (cardIndex < 0 || cardIndex >= currentHand.length) return;

        const card = currentHand[cardIndex];
        const cardValue = cardValueToInt(card.value);

        // إذا كانت الورقة من نوع ديناري، يتم حساب النقاط الخاصة بها
        if (card.suit === 'diamonds') {
            if (currentPlayer === 1) player1DinariCount++;
            else player2DinariCount++;
        }

        // تحقق من وجود مطابقة
        const matchingCardIndex = middleCards.findIndex(c => cardValueToInt(c.value) === cardValue);
        if (matchingCardIndex !== -1) {
            collectedCards.push(middleCards.splice(matchingCardIndex, 1)[0]); 
            collectedCards.push(card);
        } else {
            const combinations = findSummingCombinations(middleCards, cardValue);
            if (combinations.length > 0) {
                combinations[0].forEach(match => {
                    const index = middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                    if (index !== -1) {
                        collectedCards.push(middleCards.splice(index, 1)[0]);
                    }
                });
                collectedCards.push(card);
            } else {
                middleCards.push(card);
            }
        }

        currentHand.splice(cardIndex, 1); // إزالة الورقة من يد اللاعب

        // إذا كانت أوراق الوسط فارغة بعد الحركة
        if (middleCards.length === 0) alert("شكبـّة!");

        // التبديل إلى اللاعب الآخر
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        // تحديث العرض بعد كل حركة
        updateDisplay();
    }

    // حساب نهاية الجولة
    function endRound() {
        roundOver = true;
        calculatePoints();
        alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);
        if (player1Score > player2Score) {
            alert("اللاعب 1 فاز!");
        } else if (player2Score > player1Score) {
            alert("اللاعب 2 فاز!");
        } else {
            alert("تعادل!");
        }
    }

    // حساب النقاط بناءً على القوانين
    function calculatePoints() {
        // حساب ديناري
        if (player1DinariCount > player2DinariCount) player1Score++;
        if (player2DinariCount > player1DinariCount) player2Score++;

        // شروط أوراق الديناري
        if (player1DinariCount === 8 || player1DinariCount === 9) {
            player1Score += 10;
            player2Score = 0;
        }
        if (player2DinariCount === 8 || player2DinariCount === 9) {
            player2Score += 10;
            player1Score = 0;
        }

        // حساب النقاط الخاصة بورقة 7 ديناري و 7 + 6
        if (player1SevenCount === 3) player1Score++;
        if (player2SevenCount === 3) player2Score++;

        // فحص الكارطة
        if (player1Score > 20) player1Score++;
        if (player2Score > 20) player2Score++;
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

    // إيجاد التركيبات المجمعة
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
