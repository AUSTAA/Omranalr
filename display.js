const suitSymbols = {
    hearts: '♥',
    spades: '♠',
    diamonds: '♦',
    clubs: '♣'
};

function displayCards(elementId, cards) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit}`;
        cardElement.setAttribute('data-value', card.value);
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${suitSymbols[card.suit]}</div>
            <div class="symbol">${suitSymbols[card.suit]}</div>
            <div class="bottom-right">${card.value}<br>${suitSymbols[card.suit]}</div>
        `;
        container.appendChild(cardElement);
    });
}

function displayCollectedCards(elementId, cards) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    cards.forEach((_, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card collected-card';
        cardElement.style.top = `${index * 2}px`;
        cardElement.style.left = `${index * 2}px`;
        container.appendChild(cardElement);
    });
}
