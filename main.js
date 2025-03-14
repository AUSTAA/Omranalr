document.addEventListener("DOMContentLoaded", () => {
    // إضافة حدث عند الضغط على زر بدء اللعبة
    document.getElementById("start-game").addEventListener("click", initializeGame);
    initializeGame();
});

// دالة بدء اللعبة
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
    currentPlayer = 1;
    roundOver = false;
    dealInitialCards();
    updateDisplay();
}

// دالة توزيع الأوراق الأولية
function dealInitialCards() {
    for (let i = 0; i < 3; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        middleCards.push(deck.pop());
    }
}

// دالة تحديث العرض
function updateDisplay() {
    renderCards("player1-hand", player1Hand, 1);
    renderCards("player2-hand", player2Hand, 2);
    renderCards("middle-cards", middleCards);

    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
}

// دالة عرض الأوراق
function renderCards(containerId, cards, player) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
        `;
        cardElement.addEventListener("click", () => playCard(index, player));
        container.appendChild(cardElement);
    });
}

// دالة لعب الورقة
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

    // التحقق من الشكبة (إذا كانت أوراق الوسط فارغة بعد الحركة)
    if (middleCards.length === 0) {
        const lastCard = cardValueToInt(card.value); // قيمة آخر ورقة
        collectedCards.push({ value: lastCard, suit: card.suit }); // إضافة الشكبة
        alert("شكبـّة! + " + lastCard + " نقطة");
    }

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

// دالة لتوزيع الأوراق الجديدة بعد كل جولة
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

// دالة لإنهاء الجولة
function endRound() {
    roundOver = true;

    let player1Diamonds = player1Collected.filter(card => card.suit === "diamonds").length;
    let player2Diamonds = player2Collected.filter(card => card.suit === "diamonds").length;

    if (player1Diamonds > player2Diamonds) player1Score += 1;
    else if (player2Diamonds > player1Diamonds) player2Score += 1;

    if (player1Diamonds >= 8) {
        player1Score += 10;
        player2Score = 0;
    } else if (player2Diamonds >= 8) {
        player2Score += 10;
        player1Score = 0;
    }

    alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);

    // التحقق من انتهاء الشوط عند 61 نقطة
    if (player1Score >= 61 || player2Score >= 61) {
        alert(player1Score >= 61 ? "اللاعب 1 فاز!" : "اللاعب 2 فاز!");
        player1Score = 0;
        player2Score = 0;
    }

    initializeGame();
}

function cardValueToInt(value) {
    switch (value) {
        case "A": return 1;
        case "Q": return 8;
        case "J": return 9;
        case "K": return 10;
        default: return parseInt(value);
    }
}
