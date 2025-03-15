const Rules = {
    checkShkba: function (middleCards, lastCard, collectedCards, playerScore) {
        if (middleCards.length === 0) {
            playerScore += parseInt(lastCard.value);
            UI.showMessage("شكبـّة! +" + lastCard.value + " نقطة");
        }
    },

    checkBarmeela: function (collectedCards, playerScore) {
        const sevens = collectedCards.filter(c => c.value === "7").length;
        const sixes = collectedCards.filter(c => c.value === "6").length;
        const sevenDiamonds = collectedCards.some(c => c.value === "7" && c.suit === "diamonds");

        if (sevens >= 3 || (sevens >= 2 && sixes >= 3)) {
            playerScore += 1;
            UI.showMessage("برميلة! +1 نقطة");
        }

        if (sevenDiamonds) {
            playerScore += 1;
            UI.showMessage("🐍 7 ديناري! +1 نقطة");
        }
    },

    checkBaji: function (player1Cards, player2Cards) {
        return (player1Cards.length === 20 && player2Cards.length === 20) ||
               (player1Cards.filter(c => c.suit === "diamonds").length === 5 ||
                player2Cards.filter(c => c.suit === "diamonds").length === 5);
    }
};
