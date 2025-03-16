// قوانين اللعبة

// 1. حساب نقاط الشكبة (Shkba)
// عند حدوث شكبة، تُضاف قيمة الورقة الأخيرة في الوسط إلى نقاط اللاعب.
function handleShkba(cardValue, collectedCards) {
    if (middleCards.length === 0) {
        collectedCards.push({ value: cardValue, suit: 'hearts' });
        alert(`شكبـّة! + ${cardValue} نقطة`);
    }
}

// 2. حساب نقاط البرميلة (Barmeela) والحية (🐍)
// - عند جمع **3 أوراق 7** → نقطة وتظهر رسالة "برميلة!"
// - عند جمع **2 ورقات 7 + 3 ورقات 6** → نقطة وتظهر "برميلة!"
// - عند أخذ **7 ديناري** → نقطة وتظهر 🐍
function checkBarmeelaAndSnake(playerCards, collectedCards) {
    const sevenCount = playerCards.filter(card => card.value === "7").length;
    const sixCount = playerCards.filter(card => card.value === "6").length;
    const dinariCount = playerCards.filter(card => card.suit === "diamonds").length;

    if (sevenCount === 3) {
        alert("برميلة!");
        collectedCards.push({ value: 7, suit: 'hearts' }); // أو حسب الورقة
    }
    if (sevenCount === 2 && sixCount === 3) {
        alert("برميلة!");
        collectedCards.push({ value: 7, suit: 'hearts' }); // أو حسب الورقة
    }
    if (dinariCount === 7) {
        alert("🐍");
        collectedCards.push({ value: 7, suit: 'diamonds' });
    }
}

// 3. نظام "باجي" (Baji)
// - "الديناري باجي" عند أخذ 5 أوراق ديناري → لا تُحسب النقاط لأي طرف.
// - "البرميلة باجي" عند أخذ **2 سبعات + 2 ستات** → لا تُحسب النقاط.
// - "الكارطة باجي" عند أخذ كل لاعب **20 ورقة بالضبط** → لا تُحسب نقطة.
function handleBaji(playerCards, collectedCards) {
    if (playerCards.filter(card => card.suit === "diamonds").length === 5) {
        alert("الديناري باجي!");
        collectedCards.length = 0;  // لا تُحسب النقاط
    }
    if (playerCards.filter(card => card.value === "7").length === 2 &&
        playerCards.filter(card => card.value === "6").length === 2) {
        alert("البرميلة باجي!");
        collectedCards.length = 0;  // لا تُحسب النقاط
    }
    if (playerCards.length === 20) {
        alert("الكارطة باجي!");
        collectedCards.length = 0;  // لا تُحسب النقاط
    }
}

// 4. إنهاء الشوط عند وصول أحد اللاعبين إلى 61 نقطة
function checkEndOfGame() {
    if (player1Score >= 61 || player2Score >= 61) {
        alert(player1Score >= 61 ? "اللاعب 1 فاز!" : "اللاعب 2 فاز!");
        resetScores();
    }
}

// 5. النقاط عند انتهاء الجولة واحتسابها
function endRound() {
    roundOver = true;
    let player1Diamonds = player1Collected.filter(card => card.suit === "diamonds").length;
    let player2Diamonds = player2Collected.filter(card => card.suit === "diamonds").length;

    if (player1Diamonds > player2Diamonds) {
        player1Score += 1;
    } else if (player2Diamonds > player1Diamonds) {
        player2Score += 1;
    }

    if (player1Diamonds >= 8) {
        player1Score += 10;
        player2Score = 0;
    } else if (player2Diamonds >= 8) {
        player2Score += 10;
        player1Score = 0;
    }

    alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);
    
    checkEndOfGame();
}

// 6. تحديد من يبدأ الجولة التالية (القانون رقم 13)
function determineStartingPlayer() {
    if (player1Score > player2Score) {
        currentPlayer = 1;
    } else if (player2Score > player1Score) {
        currentPlayer = 2;
    }
}

// 7. إذا كانت الأوراق المتبقية في الوسط لم تُأخذ بعد، يتم أخذها من قبل آخر لاعب أخذ ورقة.
function handleRemainingCards() {
    if (middleCards.length > 0) {
        if (roundOver) {
            alert("اللاعب الذي أخذ آخر ورقة من الوسط سيأخذ الأوراق المتبقية.");
        }
    }
}
