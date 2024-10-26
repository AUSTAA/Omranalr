document.addEventListener('DOMContentLoaded', () => {
    let deck = createDeck();
    deck = shuffleDeck(deck);

    const player1Hand = [];
    const player2Hand = [];
    const middleCards = [];
    const player1Collected = [];
    const player2Collected = [];

    dealInitialCards(player1Hand, player2Hand, middleCards, deck);

    displayCards('player1-cards', player1Hand);
    displayCards('player2-cards', player2Hand);
    displayCards('middle-cards-container', middleCards);

    document.getElementById('player1-cards').addEventListener('click', event => {
        if (currentPlayer === 1) playCard(event, player1Hand, player1Collected, middleCards);
    });

    document.getElementById('player2-cards').addEventListener('click', event => {
        if (currentPlayer === 2) playCard(event, player2Hand, player2Collected, middleCards);
    });
});
