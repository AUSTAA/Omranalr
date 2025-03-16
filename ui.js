// دوال الواجهة الرسومية لعرض الأوراق وتحديث النقاط

function renderCards(containerId, cards) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
        `;
        cardElement.addEventListener("click", () => playCard(card));
        container.appendChild(cardElement);
    });
}

function updateDisplay() {
    renderCards("player1-hand", player1Hand);
    renderCards("player2-hand", player2Hand);
    renderCards("middle-cards", middleCards);

    document.getElementById("player1-score").textContent = player1Score;
    document.getElementById("player2-score").textContent = player2Score;
}
