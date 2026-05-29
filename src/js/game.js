function createGame(cardCount = 8) { // againe ill maybe do a class of it
    const deck = createDeck();

    const pairCount = cardCount / 2;

    const shuffledDeck = shuffle(deck);

    const selectedCards = shuffledDeck.slice(0, pairCount);

    const gameCards = [...selectedCards, ...selectedCards];

    return shuffle(gameCards).map((card, index) => ({
        id: index,
        symbol: card.symbol,
        flipped: false,
        matched: false
    }));
}

function checkMatch() {
    lockBoard = true;
  
    const isMatch = firstCard.symbol === secondCard.symbol;
  
    if (isMatch) {
      firstCard.matched = true;
      secondCard.matched = true;
  
      resetTurn();
  
      checkWin();
  
    } else {
  
      setTimeout(() => {
        firstCard.flipped = false;
        secondCard.flipped = false;
  
        resetTurn();
  
        updateUI();
  
      }, 1000);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function checkWin() {
    const won = cards.every(card => card.matched);
  
    if (won) {
      alert("Bravo !");
    }
}

function startGame(difficulty) {
    const cardCount = difficulties[difficulty];
  
    cards = createGame(cardCount);
  
    resetTurn();
  
    updateUI();
}

const difficulties = { // ill see for a custome one
    easy: 8,
    medium: 16,
    hard: 24
};