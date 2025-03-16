// ui.js - مسؤول عن تحديث الواجهة وعرض الرسائل

function renderCards(containerId, cards) {
    let container = document.getElementById(containerId);
    container.innerHTML = "";

    cards.forEach((card, index) => {
        let cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.textContent = `${card.value} ${card.suit}`;
        cardDiv.onclick = () => playCard(containerId.includes("player1") ? 1 : 2, index);
        container.appendChild(cardDiv);
    });
}

function updateDisplay() {
    renderCards("player1-hand", player1Hand);
    renderCards("player2-hand", player2Hand);
    renderCards("middle-cards", middleCards);

    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
}

function showMessage(message) {
    let messageDiv = document.getElementById("game-message");
    messageDiv.textContent = message;
    setTimeout(() => { messageDiv.textContent = ""; }, 3000);
}
