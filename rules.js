// rules.js - يحتوي على القوانين الخاصة باللعبة

// حساب النقاط بناءً على القوانين
function calculatePoints(playerHand, middleCards, playerScore) {
    let points = 0;

    // 1. شكبة - عند حدوثها، تُضاف قيمة الورقة الأخيرة في الوسط إلى نقاط اللاعب
    if (middleCards.length === 0) {
        points += playerHand[playerHand.length - 1].value;
    }

    // 2. البرميلة - عند جمع أنواع محددة من الأوراق
    let sevens = playerHand.filter(card => card.value === 7).length;
    let sixes = playerHand.filter(card => card.value === 6).length;
    let hasSevenDinars = playerHand.some(card => card.value === 7 && card.suit === "ديناري");

    if (sevens === 3 || (sevens === 2 && sixes === 3)) {
        points += 1;
        showMessage("برميلة!");
    }

    if (hasSevenDinars) {
        points += 1;
        showMessage("🐍 الحية! (7 ديناري)");
    }

    return playerScore + points;
}
