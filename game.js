document.addEventListener("DOMContentLoaded", () => {
    const suits = ["hearts", "spades", "diamonds", "clubs"];
    const suitSymbols = { hearts: "♥", spades: "♠", diamonds: "♦", clubs: "♣" };
    const values = ["A", "2", "3", "4", "5", "6", "7", "Q", "J", "K"];
    let deck, player1Hand, player2Hand, middleCards, player1Collected, player2Collected;
    let player1Score = 0, player2Score = 0;
    let currentPlayer = 1;
    let roundOver = false;

    function initializeGame() {
        deck = createDeck();
        shuffleDeck(deck);
        player1Hand = [];
        player2Hand = [];
        middleCards = [];
        player1Collected = [];
        player2Collected = [];
        dealInitialCards();
        currentPlayer = 1;
        roundOver = false;
        updateDisplay();
    }

    function createDeck() {
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
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

    function updateDisplay() {
        renderCards("player1-hand", player1Hand, 1);
        renderCards("player2-hand", player2Hand, 2);
        renderCards("middle-cards", middleCards);

        document.getElementById("player1-score").textContent = player1Score;
        document.getElementById("player2-score").textContent = player2Score;
    }

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

    // لعب الورقة
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
        collectedCards.push({value: lastCard, suit: card.suit}); // إضافة الشكبة
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

    function findBestMatch(card, middleCards) {
        let possibleMatches = middleCards.filter(c => cardValueToInt(c.value) === cardValueToInt(card.value));
        let diamondMatches = possibleMatches.filter(c => c.suit === "diamonds");

        return diamondMatches.length > 0 ? diamondMatches : possibleMatches;
    }

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

    document.getElementById("start-game").addEventListener("click", initializeGame);
    initializeGame();
});
