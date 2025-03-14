// قانون الشكبة: إضافة قيمة الشكبة إلى النقاط
function checkShkba(card) {
    if (middleCards.length === 0) {
        const lastCard = cardValueToInt(card.value);
        collectedCards.push({ value: lastCard, suit: card.suit });
        alert("شكبـّة! + " + lastCard + " نقطة");
    }
}

// قانون البرميلة والحية
function checkBarmeelaAndSnake() {
    // 3 سبعات
    if (middleCards.filter(card => card.value === "7").length === 3) {
        alert("برميلة!");
        player1Score += 1;
    }
    // 2 سبعات و3 ستات
    if (middleCards.filter(card => card.value === "7").length === 2 && middleCards.filter(card => card.value === "6").length === 3) {
        alert("برميلة!");
        player1Score += 1;
    }
    // 7 ديناري
    if (middleCards.some(card => card.value === "7" && card.suit === "diamonds")) {
        alert("🐍");
        player1Score += 1;
    }
}

// قوانين الباجي
function checkBaji() {
    // ديناري باجي
    if (player1Hand.filter(card => card.suit === "diamonds").length === 5) {
        alert("الديناري باجي");
        return false;
    }
    // البرميلة باجي
    if (middleCards.filter(card => card.value === "7").length === 2 && middleCards.filter(card => card.value === "6").length === 2) {
        alert("البرميلة باجي");
        return false;
    }
    // الكارطة باجي
    if (player1Hand.length === 20) {
        alert("الكارطة باجي");
        return false;
    }
    return true;
}

// نهاية الشوط
function checkEndOfGame() {
    if (player1Score >= 61 || player2Score >= 61) {
        alert(player1Score >= 61 ? "اللاعب 1 فاز!" : "اللاعب 2 فاز!");
        player1Score = 0;
        player2Score = 0;
    }
}