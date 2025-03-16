// main.js - تشغيل اللعبة وربط الأحداث

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-game").addEventListener("click", startGame);
});

// دالة بدء اللعبة
function startGame() {
    deck = generateDeck();
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

// توزيع الأوراق الأولية
function dealInitialCards() {
    for (let i = 0; i < 4; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        middleCards.push(deck.pop());
    }
}

// تحديث عرض اللعبة
function updateDisplay() {
    renderCards("player1-hand", player1Hand, 1);
    renderCards("player2-hand", player2Hand, 2);
    renderCards("middle-cards", middleCards);

    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
}

// عند لعب ورقة
function playCard(cardIndex, player) {
    if (roundOver) return; 

    if (currentPlayer !== player) {
        alert("ليس دورك!");
        return;
    }

    let playerHand = currentPlayer === 1 ? player1Hand : player2Hand;
    let playerCollected = currentPlayer === 1 ? player1Collected : player2Collected;
    let playerScore = currentPlayer === 1 ? player1Score : player2Score;

    if (cardIndex < 0 || cardIndex >= playerHand.length) return;

    let playedCard = playerHand.splice(cardIndex, 1)[0];
    let matchedIndex = middleCards.findIndex(card => card.value === playedCard.value);

    if (matchedIndex !== -1) {
        // اللاعب أخذ ورقة مطابقة
        playerCollected.push(middleCards.splice(matchedIndex, 1)[0]);
        playerCollected.push(playedCard);

        // ✅ التحقق من الشكبة (Shkba)
        if (middleCards.length === 0) {
            playerScore += playedCard.value;
            alert(`شكبـّة! +${playedCard.value} نقطة`);
        }

    } else {
        // ✅ التحقق من مجموع مطابق
        let combinations = findSummingCombinations(middleCards, playedCard.value);
        if (combinations.length > 0) {
            combinations[0].forEach(match => {
                let index = middleCards.findIndex(c => c.value === match.value);
                if (index !== -1) {
                    playerCollected.push(middleCards.splice(index, 1)[0]);
                }
            });
            playerCollected.push(playedCard);
        } else {
            // لم يكن هناك تطابق، تُضاف الورقة إلى الوسط
            middleCards.push(playedCard);
        }
    }

    // ✅ التحقق من البرميلة (Barmeela)
    let sevenCount = playerCollected.filter(card => card.value === 7).length;
    let sixCount = playerCollected.filter(card => card.value === 6).length;

    if (sevenCount === 3 || (sevenCount === 2 && sixCount === 3)) {
        playerScore += 1;
        alert("برميلة! +1 نقطة");
    }

    // ✅ التحقق من الحية (🐍)
    if (playerCollected.some(card => card.value === 7 && card.suit === "diamonds")) {
        playerScore += 1;
        alert("🐍 أخذت 7 ديناري! +1 نقطة");
    }

    // ✅ التحقق من "باجي" (Baji)
    let diamondCount = playerCollected.filter(card => card.suit === "diamonds").length;
    if (diamondCount === 5) {
        alert("الديناري باجي! إلغاء جميع النقاط!");
        player1Score = 0;
        player2Score = 0;
    }

    if (sevenCount === 2 && sixCount === 2) {
        alert("البرميلة باجي! إلغاء النقاط!");
        playerScore = 0;
    }

    if (player1Collected.length === 20 && player2Collected.length === 20) {
        alert("الكارطة باجي! لا تُحسب نقاط!");
    }

    // تحديث نقاط اللاعب
    if (currentPlayer === 1) {
        player1Score = playerScore;
    } else {
        player2Score = playerScore;
    }

    // التحقق من نهاية الجولة
    if (player1Hand.length === 0 && player2Hand.length === 0) {
        dealNextCards();
    } else {
        // التبديل إلى اللاعب الآخر
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    // تحديث العرض بعد كل حركة
    updateDisplay();
}

// توزيع أوراق جديدة بعد انتهاء الأوراق الحالية
function dealNextCards() {
    if (deck.length >= 8) {
        for (let i = 0; i < 4; i++) {
            player1Hand.push(deck.pop());
            player2Hand.push(deck.pop());
        }
    } else {
        endRound();
    }
}

// إنهاء الجولة وحساب النقاط
function endRound() {
    roundOver = true;

    alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);

    if (player1Score >= 61 || player2Score >= 61) {
        alert(player1Score >= 61 ? "اللاعب 1 فاز!" : "اللاعب 2 فاز!");
        player1Score = 0;
        player2Score = 0;
    }

    startGame();
}
