function playCard(event, playerHand, playerCollected, middleCards) {
    const cardElement = event.target.closest('.card');
    if (!cardElement) return;

    const cardValue = cardElement.querySelector('.top-left').textContent[0];
    const cardSuit = cardElement.classList[1];
    const card = { value: cardValue, suit: cardSuit };

    const cardIndex = playerHand.findIndex(c => c.value === card.value && c.suit === card.suit);
    if (cardIndex === -1) return;
    playerHand.splice(cardIndex, 1);

    const cardValueInt = cardValueToInt(card.value);
    const possibleCombinations = findAllSummingCombinations(middleCards, cardValueInt);

    if (possibleCombinations.length > 0) {
        showCombinationOptions(possibleCombinations, card, playerCollected, middleCards);
    } else {
        middleCards.push(card);
        displayCards('middle-cards-container', middleCards);
        switchTurn();
    }
}
