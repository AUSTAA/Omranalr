// === تعريف المتغيرات الأساسية ===
let deck = [];
let player1Hand = [], player2Hand = [], middleCards = [];
let player1Collected = [], player2Collected = [];
let player1Score = 0, player2Score = 0;
let currentPlayer = 1;
let roundOver = false;
let lastPlayerToTake = null; // لتحديد آخر لاعب أخذ أوراق من الوسط

// === تحميل اللعبة عند فتح الصفحة ===
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-game").addEventListener("click", initializeGame);
    initializeGame();
});

// === دالة تهيئة اللعبة ===
function initializeGame() {
    deck = createDeck();
    shuffleDeck(deck);
    player1Hand = [];
    player2Hand = [];
    middleCards = [];
    player1Collected = [];
    player2Collected = [];
    roundOver = false;
    dealInitialCards();
    updateDisplay();
}

// === إنشاء رزمة الأوراق ===
function createDeck() {
    let suits = ["hearts", "diamonds", "clubs", "spades"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

// === خلط الأوراق ===
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// === توزيع الأوراق الأولية ===
function dealInitialCards() {
    for (let i = 0; i < 3; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        middleCards.push(deck.pop());
    }
}

// === تحديث الواجهة ===
function updateDisplay() {
    renderCards("player1-hand", player1Hand, 1);
    renderCards("player2-hand", player2Hand, 2);
    renderCards("middle-cards", middleCards);
    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
}

const suitSymbols = {
    "hearts": "♥",
    "diamonds": "♦",
    "clubs": "♣",
    "spades": "♠"
};

function renderCards(containerId, cards, player) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    cards.forEach((card, index) => {
        let displayValue = card.value; // القيمة الأصلية

        // تحويل القيم إلى الرموز المطلوبة
        if (card.value === "8") displayValue = "Q";
        else if (card.value === "9") displayValue = "J";
        else if (card.value === "10") displayValue = "K";

        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <div class="top-left">${displayValue}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${displayValue}<br>${suitSymbols[card.suit]}</div>
        `;
        cardElement.addEventListener("click", () => playCard(index, player));
        container.appendChild(cardElement);
    });
}

// === لعب ورقة ===
function playCard(cardIndex, player) {
    if (roundOver) return;
    if (player !== currentPlayer) {
        alert("ليس دورك!");
        return;
    }

    let currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
    let collectedCards = currentPlayer === 1 ? player1Collected : player2Collected;

    if (cardIndex < 0 || cardIndex >= currentHand.length) return;

    let card = currentHand[cardIndex];
    let cardValue = cardValueToInt(card.value);

    // البحث عن تطابق مباشر
    let matchIndex = middleCards.findIndex(c => cardValueToInt(c.value) === cardValue);
    if (matchIndex !== -1) {
        collectedCards.push(middleCards.splice(matchIndex, 1)[0]);
        collectedCards.push(card);
        lastPlayerToTake = currentPlayer; // تحديث آخر لاعب أخذ أوراق
    } else {
        let combinations = findSummingCombinations(middleCards, cardValue);
        if (combinations.length > 0) {
            combinations[0].forEach(match => {
                let index = middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                if (index !== -1) {
                    collectedCards.push(middleCards.splice(index, 1)[0]);
                }
            });
            collectedCards.push(card);
            lastPlayerToTake = currentPlayer;
        } else {
            middleCards.push(card);
        }
    }

    currentHand.splice(cardIndex, 1);

    // === التحقق من الشكبة ===
    if (middleCards.length === 0) {
        player1Score += cardValue;
        alert("شكبـّة! +" + cardValue + " نقطة");
    }

    // === إنهاء الجولة ===
    if (player1Hand.length === 0 && player2Hand.length === 0) {
        endRound();
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    updateDisplay();
}

// === إنهاء الجولة وحساب النقاط ===
function endRound() {
    roundOver = true;

    // قانون 11: إذا بقيت أوراق غير مأخوذة، يأخذها آخر لاعب أخذ من الوسط
    if (middleCards.length > 0 && lastPlayerToTake !== null) {
        let collectedCards = lastPlayerToTake === 1 ? player1Collected : player2Collected;
        collectedCards.push(...middleCards);
        middleCards = [];
    }

    // حساب النقاط بناءً على القوانين المختلفة
    calculatePoints();

    // === قانون 13: اللاعب الأكثر نقاطًا يبدأ الجولة الجديدة ===
    currentPlayer = player1Score > player2Score ? 1 : 2;

    alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);

    // التحقق من نهاية الشوط
    if (player1Score >= 61 || player2Score >= 61) {
        alert(player1Score >= 61 ? "اللاعب 1 فاز!" : "اللاعب 2 فاز!");
        player1Score = 0;
        player2Score = 0;
    }

    initializeGame();
}

// === حساب النقاط بناءً على القوانين ===
function calculatePoints() {
    let player1Diamonds = player1Collected.filter(c => c.suit === "diamonds").length;
    let player2Diamonds = player2Collected.filter(c => c.suit === "diamonds").length;

    if (player1Diamonds > player2Diamonds) player1Score += 1;
    else if (player2Diamonds > player1Diamonds) player2Score += 1;

    if (player1Diamonds >= 8) player1Score += 10;
    if (player2Diamonds >= 8) player2Score += 10;
}

// === تحويل قيمة البطاقة إلى رقمية ===
function cardValueToInt(value) {
    return value === "A" ? 1 : value === "Q" ? 8 : value === "J" ? 9 : value === "K" ? 10 : parseInt(value);
}

// === البحث عن مجموع مطابق ===
function findSummingCombinations(cards, targetValue) {
    return cards.filter(c => cardValueToInt(c.value) === targetValue);
}
