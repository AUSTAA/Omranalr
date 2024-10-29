// ui.js
export function displayCards(elementId, cards) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit}`;
        cardElement.setAttribute('data-value', card.value);
        cardElement.innerHTML = `
            <div class="top-left">${card.value}<br>${getSuitSymbol(card.suit)}</div>
            <div class="symbol">${getSuitSymbol(card.suit)}</div>
            <div class="bottom-right">${card.value}<br>${getSuitSymbol(card.suit)}</div>
        `;
        container.appendChild(cardElement);
    });
}

export function displayCollectedCards(elementId, cards) {
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

function getSuitSymbol(suit) {
    const symbols = { hearts: '♥', spades: '♠', diamonds: '♦', clubs: '♣' };
    return symbols[suit];
}
