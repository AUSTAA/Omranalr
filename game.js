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

    let takenCards = [];
    const matchingCardIndex = middleCards.findIndex(c => cardValueToInt(c.value) === cardValue);

    if (matchingCardIndex !== -1) {
        takenCards.push(middleCards[matchingCardIndex], card);
        collectedCards.push(middleCards.splice(matchingCardIndex, 1)[0]);
        collectedCards.push(card);
        lastPlayerToTake = currentPlayer;
    } else {
        const combinations = findSummingCombinations(middleCards, cardValue);
        if (combinations.length > 0) {
            combinations[0].forEach(match => {
                takenCards.push(match);
                const index = middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                if (index !== -1) {
                    collectedCards.push(middleCards.splice(index, 1)[0]);
                }
            });
            collectedCards.push(card);
            takenCards.push(card);
            lastPlayerToTake = currentPlayer;
        } else {
            middleCards.push(card);
        }
    }

    // عرض الأوراق التي تم أخذها
    if (takenCards.length > 0) {
        alert(`اللاعب ${currentPlayer} أخذ: ${takenCards.map(c => c.value + suitSymbols[c.suit]).join(", ")}`);
    }

    currentHand.splice(cardIndex, 1);

    if (middleCards.length === 0) {
        card.shkba = true;
        collectedCards.push(card);
        alert("شكبـّة! + " + cardValue + " نقطة");
    }

    if (player1Hand.length === 0 && player2Hand.length === 0) {
        if (deck.length > 0) {
            dealNextCards();
            currentPlayer = currentPlayer === 1 ? 2 : 1;
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

    // توزيع الأوراق المتبقية في الوسط
    if (lastPlayerToTake === 1) {
        player1Collected.push(...middleCards);
    } else if (lastPlayerToTake === 2) {
        player2Collected.push(...middleCards);
    }

    let player1Diamonds = player1Collected.filter(card => card.suit === "diamonds").length;
    let player2Diamonds = player2Collected.filter(card => card.suit === "diamonds").length;

    let player1Sevens = player1Collected.filter(card => card.value === "7").length;
    let player2Sevens = player2Collected.filter(card => card.value === "7").length;

    let player1Sixes = player1Collected.filter(card => card.value === "6").length;
    let player2Sixes = player2Collected.filter(card => card.value === "6").length;

    let player1CardsCount = player1Collected.length;
    let player2CardsCount = player2Collected.length;

    let player1Points = 0;
    let player2Points = 0;
    let player1Details = [];
    let player2Details = [];

    let bajiConditions = {
        "الديناري باجي": player1Diamonds >= 5 && player2Diamonds >= 5,
        "البرميلة باجي": (player1Sevens >= 2 && player1Sixes >= 2) && (player2Sevens >= 2 && player2Sixes >= 2),
        "الكارطة باجي": player1CardsCount === 20 && player2CardsCount === 20
    };

    let bajiActive = Object.values(bajiConditions).some(value => value);

    if (bajiConditions["الديناري باجي"]) {
        player1Details.push("الديناري باجي");
        player2Details.push("الديناري باجي");
    }
    if (bajiConditions["البرميلة باجي"]) {
        player1Details.push("البرميلة باجي");
        player2Details.push("البرميلة باجي");
    }
    if (bajiConditions["الكارطة باجي"]) {
        player1Details.push("الكارطة باجي");
        player2Details.push("الكارطة باجي");
    }

    let player1ShkbaPoints = player1Collected.filter(card => card.shkba).reduce((sum, card) => sum + cardValueToInt(card.value), 0);
    let player2ShkbaPoints = player2Collected.filter(card => card.shkba).reduce((sum, card) => sum + cardValueToInt(card.value), 0);

    if (player1ShkbaPoints > 0) {
        player1Points += player1ShkbaPoints;
        player1Details.push(`شكبة ${player1ShkbaPoints}`);
    }
    if (player2ShkbaPoints > 0) {
        player2Points += player2ShkbaPoints;
        player2Details.push(`شكبة ${player2ShkbaPoints}`);
    }

    if (!bajiActive) {
        if (player1Diamonds > player2Diamonds) {
            player1Points += 1;
            player1Details.push("ديناري 1");
        } else if (player2Diamonds > player1Diamonds) {
            player2Points += 1;
            player2Details.push("ديناري 1");
        }

        if (player1Sevens >= 3 || (player1Sevens >= 2 && player1Sixes >= 3)) {
            player1Points += 1;
            player1Details.push("البرميلة 1");
        }

        if (player2Sevens >= 3 || (player2Sevens >= 2 && player2Sixes >= 3)) {
            player2Points += 1;
            player2Details.push("البرميلة 1");
        }

        if (player1Collected.some(card => card.value === "7" && card.suit === "diamonds")) {
            player1Points += 1;
            player1Details.push("🐍 الحية 1");
        }

        if (player2Collected.some(card => card.value === "7" && card.suit === "diamonds")) {
            player2Points += 1;
            player2Details.push("🐍 الحية 1");
        }

        player1Score += player1Points;
        player2Score += player2Points;
    }

    updateDisplay();

    let report = `
        <strong>نتائج الجولة:</strong><br>
        <strong>لاعب 1:</strong> ${player1Details.length > 0 ? player1Details.join(" ، ") : "لا شيء"} <br>
        <strong>لاعب 2:</strong> ${player2Details.length > 0 ? player2Details.join(" ، ") : "لا شيء"} <br>
        <br>
        <strong>النتيجة:</strong><br>
        لاعب 1 = ${player1Score} / لاعب 2 = ${player2Score}
    `;

    alert(report.replace(/<br>/g, "\n"));
    document.getElementById("round-summary").innerHTML = report;

    if (player1Score >= 61 || player2Score >= 61) {
        alert(player1Score >= 61 ? "🎉 اللاعب 1 فاز!" : "🎉 اللاعب 2 فاز!");
        player1Score = 0;
        player2Score = 0;
    }

    initializeGame();
}

function cardValueToInt(value) {
    return value === "A" ? 1 : value === "Q" ? 8 : value === "J" ? 9 : value === "K" ? 10 : parseInt(value);
}

function findSummingCombinations(cards, targetValue) {
    let result = [];

    function findSubset(currentSubset, remainingCards, sum) {
        if (sum === targetValue) {
            result.push([...currentSubset]);
            return;
        }
        if (sum > targetValue || remainingCards.length === 0) return;

        findSubset([...currentSubset, remainingCards[0]], remainingCards.slice(1), sum + cardValueToInt(remainingCards[0].value));
        findSubset(currentSubset, remainingCards.slice(1), sum);
    }

    findSubset([], cards, 0);
    return result;
}

function dealNextCards() {
    for (let i = 0; i < 3; i++) {
        if (deck.length > 0) player1Hand.push(deck.pop());
        if (deck.length > 0) player2Hand.push(deck.pop());
    }
    updateDisplay();
}
