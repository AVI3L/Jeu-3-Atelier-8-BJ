const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

function createDeck() { // maybe ill do an class for the deck and cards later for now its make it
    const deck = [];

    for (const suit of suits) {
        for (const value of values) {
            deck.push({
                symbol: `${value}${suit}`
            });
        }
    }

    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard(cardId) {
    if (lockBoard) return;
  
    const card = cards.find(c => c.id === cardId);
  
    if (card.flipped || card.matched) return;
  
    card.flipped = true;
  
    updateUI();
  
    if (!firstCard) {
      firstCard = card;
      return;
    }
  
    secondCard = card;
  
    checkMatch();
}