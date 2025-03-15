const Game = {
    deck: [],
    player1Hand: [],
    player2Hand: [],
    middleCards: [],
    player1Collected: [],
    player2Collected: [],
    player1Score: 0,
    player2Score: 0,
    currentPlayer: 1,
    roundOver: false,

    initializeGame: function () {
        this.deck = Deck.createDeck();
        Deck.shuffleDeck(this.deck);
        this.player1Hand = [];
        this.player2Hand = [];
        this.middleCards = [];
        this.player1Collected = [];
        this.player2Collected = [];
        this.dealInitialCards();
        this.currentPlayer = 1;
        this.roundOver = false;
        UI.updateDisplay();
    },

    dealInitialCards: function () {
        for (let i = 0; i < 3; i++) {
            this.player1Hand.push(this.deck.pop());
            this.player2Hand.push(this.deck.pop());
        }
        for (let i = 0; i < 4; i++) {
            this.middleCards.push(this.deck.pop());
        }
    },

    playCard: function (cardIndex, player) {
        if (this.roundOver) return;

        if ((this.currentPlayer === 1 && player !== 1) || (this.currentPlayer === 2 && player !== 2)) {
            alert("ليس دورك!");
            return;
        }

        const currentHand = this.currentPlayer === 1 ? this.player1Hand : this.player2Hand;
        const collectedCards = this.currentPlayer === 1 ? this.player1Collected : this.player2Collected;

        if (cardIndex < 0 || cardIndex >= currentHand.length) return;

        const card = currentHand[cardIndex];
        const cardValue = parseInt(card.value) || 0;

        let matchingCardIndex = this.middleCards.findIndex(c => parseInt(c.value) === cardValue);

        if (matchingCardIndex !== -1) {
            collectedCards.push(this.middleCards.splice(matchingCardIndex, 1)[0]);
            collectedCards.push(card);
        } else {
            let combinations = this.findSummingCombinations(this.middleCards, cardValue);

            if (combinations.length > 0) {
                combinations[0].forEach(match => {
                    let index = this.middleCards.findIndex(c => c.value === match.value && c.suit === match.suit);
                    if (index !== -1) {
                        collectedCards.push(this.middleCards.splice(index, 1)[0]);
                    }
                });
                collectedCards.push(card);
            } else {
                this.middleCards.push(card);
            }
        }

        currentHand.splice(cardIndex, 1);

        Rules.checkShkba(this.middleCards, card, collectedCards, this.currentPlayer === 1 ? this.player1Score : this.player2Score);
        Rules.checkBarmeela(collectedCards, this.currentPlayer === 1 ? this.player1Score : this.player2Score);

        if (this.player1Hand.length === 0 && this.player2Hand.length === 0) {
            this.dealNextCards();
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }

        UI.updateDisplay();
    },

    dealNextCards: function () {
        if (this.deck.length >= 6) {
            for (let i = 0; i < 3; i++) {
                this.player1Hand.push(this.deck.pop());
                this.player2Hand.push(this.deck.pop());
            }
        } else {
            this.endRound();
        }
    },

    endRound: function () {
        this.roundOver = true;

        if (Rules.checkBaji(this.player1Collected, this.player2Collected)) {
            UI.showMessage("باجي! لا تُحسب النقاط!");
        } else {
            if (this.player1Collected.length > this.player2Collected.length) {
                this.player1Score += 1;
            } else if (this.player2Collected.length > this.player1Collected.length) {
                this.player2Score += 1;
            }
        }

        if (this.player1Score >= 61 || this.player2Score >= 61) {
            UI.showMessage(this.player1Score >= 61 ? "اللاعب 1 فاز!" : "اللاعب 2 فاز!");
            this.player1Score = 0;
            this.player2Score = 0;
        }

        this.initializeGame();
    }
};
