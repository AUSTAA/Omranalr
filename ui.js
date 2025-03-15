// تابع تحديث العرض
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
