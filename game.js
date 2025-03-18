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
    let values = ["A", "2", "3", "4", "5", "6", "7", "Q", "J", "K"];
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

// === لعب ورقة ===
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

    const matchingCardIndex = middleCards.findIndex(c => cardValueToInt(c.value) === cardValue);

    if (matchingCardIndex !== -1) {
        collectedCards.push(middleCards.splice(matchingCardIndex, 1)[0]);
        collectedCards.push(card);
        lastWinner = currentPlayer;
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
            lastWinner = currentPlayer;
        } else {
            middleCards.push(card);
        }
    }

    currentHand.splice(cardIndex, 1);

    if (middleCards.length === 0) {
        const lastCard = cardValueToInt(card.value);
        collectedCards.push({ value: lastCard, suit: card.suit });
        alert("شكبـّة! + " + lastCard + " نقطة");
    }

    if (player1Hand.length === 0 && player2Hand.length === 0) {
    if (deck.length > 0) {
        dealNextCards();
        currentPlayer = currentPlayer === 1 ? 2 : 1; // تبديل اللاعب بعد توزيع الأوراق
    } else {
        endRound();
    }
} else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

    updateDisplay();
}

// === إنهاء الجولة وحساب النقاط ===
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

    // إضافة جميع الأوراق المتبقية في الوسط إلى آخر لاعب أخذ ورق
    if (lastWinner === 1) {
        player1Collected.push(...middleCards);
    } else if (lastWinner === 2) {
        player2Collected.push(...middleCards);
    }
    middleCards = [];

    alert(`الجولة انتهت! نقاط اللاعب 1: ${player1Score}, نقاط اللاعب 2: ${player2Score}`);

    // تحديد من يبدأ الجولة التالية
    if (player1Score > player2Score) {
        currentPlayer = 1;
    } else if (player2Score > player1Score) {
        currentPlayer = 2;
    } else {
        currentPlayer = Math.random() < 0.5 ? 1 : 2; // في حال التعادل
    }

    // التحقق من انتهاء اللعبة عند 61 نقطة
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
function dealNextCards() {
    for (let i = 0; i < 3; i++) {
        if (deck.length > 0) player1Hand.push(deck.pop());
        if (deck.length > 0) player2Hand.push(deck.pop());
    }
    updateDisplay();
}
// === تحويل قيمة البطاقة إلى رقمية ===
function cardValueToInt(value) {
    return value === "A" ? 1 : value === "Q" ? 8 : value === "J" ? 9 : value === "K" ? 10 : parseInt(value);
}

// === البحث عن مجموع مطابق ===
function findSummingCombinations(cards, targetValue) {
    let result = [];

    function findSubset(currentSubset, remainingCards, sum) {
        if (sum === targetValue) {
            result.push([...currentSubset]);
            return;
        }
        if (sum > targetValue || remainingCards.length === 0) return;

        // تضمين البطاقة الحالية في المجموعة
        findSubset([...currentSubset, remainingCards[0]], remainingCards.slice(1), sum + cardValueToInt(remainingCards[0].value));

        // تخطي البطاقة الحالية
        findSubset(currentSubset, remainingCards.slice(1), sum);
    }

    findSubset([], cards, 0);
    return result;
}
