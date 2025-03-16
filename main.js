document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-game").addEventListener("click", initializeGame);
    initializeGame();
});

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

function dealInitialCards() {
    for (let i = 0; i < 3; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        middleCards.push(deck.pop());
    }
}

function playCard(cardIndex, player) {
    if (roundOver) return;

    if ((currentPlayer === 1 && player !== 1) || (currentPlayer === 2 && player !== 2)) {
        alert("ليس دورك!");
        return;
    }

    const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
    const collectedCards = currentPlayer === 1 ? player1Collected : player2Collected;

    if (cardIndex < 0 || cardIndex >= currentHand.length) return;

    const card = currentHand[cardIndex];
    const cardValue = cardValueToInt(card.value);

    // تطبيق قوانين الشكبة والبرميلة والحية
    handleShkba(cardValue, collectedCards);
    checkBarmeelaAndSnake(currentHand, collectedCards);
    handleBaji(currentHand, collectedCards);

    // إذا لم توجد مطابقة، أضف الورقة إلى الوسط
    if (middleCards.length === 0 || !matchingCardFound) {
        middleCards.push(card);
    }

    currentHand.splice(cardIndex, 1); 

    if (middleCards.length === 0) {
        alert("اللاعب الآخر يأخذ جميع الأوراق المتبقية");
    }

    updateDisplay();
}
