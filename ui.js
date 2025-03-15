const UI = {
    updateDisplay: function () {
        this.renderCards("player1-hand", Game.player1Hand, 1);
        this.renderCards("player2-hand", Game.player2Hand, 2);
        this.renderCards("middle-cards", Game.middleCards);

        document.getElementById("player1-score").textContent = Game.player1Score;
        document.getElementById("player2-score").textContent = Game.player2Score;
    },

    showMessage: function (message) {
        const messageBox = document.getElementById("game-message");
        messageBox.textContent = message;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000);
    }
};
