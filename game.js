document.addEventListener('DOMContentLoaded', () => {
    // ... (كود البذل والرموز والمعاني لم يتغير) ...

    let deck = createDeck();
    deck = shuffleDeck(deck);

    const player1Hand = [];
    const player2Hand = [];
    const middleCards = [];
    const player1Collected = [];
    const player2Collected = [];
    const player1Points = 0;
    const player2Points = 0;

    let currentPlayer = 1;

    // Initialize hands and middle cards
    dealInitialCards();

    // Display cards
    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);
    displayCollectedCards('player1-collected', player1Collected);
    displayCollectedCards('player2-collected', player2Collected);

    // ... (مستمعو الأحداث للعب الأوراق لم يتغيروا) ...

    function createDeck() {
        // ... (بناء المجموعة لم يتغير) ...
    }

    function shuffleDeck(deck) {
        // ... (خلط المجموعة لم يتغير) ...
    }

    function dealInitialCards() {
        for (let i = 0; i < 3; i++) {
            player1Hand.push(deck.pop());
            player2Hand.push(deck.pop());
        }
    }

    function dealNewCards() {
        // ... (تعليق وظيفة توزيع أوراق جديدة مؤقتًا) ...
    }

    function displayCards(elementId, cards) {
        // ... (عرض الأوراق لم يتغير) ...
    }

    function displayCollectedCards(elementId, cards) {
        // ... (عرض الأوراق التي تم جمعها لم يتغير) ...
    }

    function playCard(event, playerHand, playerCollected, playerPoints, middleCards) {
        // ... (استخراج تفاصيل الورقة لم يتغير) ...

        const cardValueInt = cardValueToInt(card.value);

        // ابحث عن مجموعة كاملة في الوسط
        const matchingCombination = findMatchingCombination(middleCards, cardValueInt);

        if (matchingCombination.length > 0) {
            // اللاعب يأخذ جميع الأوراق في المجموعة ويحصل على نقاط لها
            matchingCombination.forEach(mc => {
                const index = middleCards.findIndex(c => c.value === mc.value && c.suit === mc.suit);
                if (index > -1) middleCards.splice(index, 1
