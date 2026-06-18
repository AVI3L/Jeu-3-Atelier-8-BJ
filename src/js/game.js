const difficulties = { // ill see for a custome one
    easy: 8,
    medium: 16,
    hard: 24
};

class Game {

    constructor(difficulty = "easy") {
        /** @type {number} */
        const cardCount = difficulties[difficulty];

        /** @type {boolean} */
        this.won = false;

        /** @type {Card|null} */
        this.firstCard = null;
        /** @type {Card|null} */
        this.secondCard = null;

        /** @type {boolean} */
        this.lockBoard = false;
        
        /** @type {Deck} */
        this.deck = new Deck();
        this.deck.shuffle();

        const pairCount = cardCount / 2;

        /** @type {Card[]} */
        const selectedCards = this.deck.cards.slice(0, pairCount);

        /** @type {Card[]} */
        this.cards = [...selectedCards, ...selectedCards];

        /** @type {Card[]} */
        const newCards = [];
        
        this.cards.forEach((card, index) => newCards.push(new Card(card.getValue(), card.getSuit()).setId(index)));

        console.log(newCards);

        this.deck = new Deck().parse(newCards);

        this.deck.shuffle();

        this.cards = this.deck.cards;

        this.resetTurn();
        
        this.updateUI();
    }

    checkMatch() {
        this.lockBoard = true;
  
        const isMatch = this.firstCard.getSymbol() === this.secondCard.getSymbol();
    
        if (isMatch) {
        this.firstCard.matched = true;
        this.secondCard.matched = true;
    
        this.resetTurn();
    
        this.checkWin();
    
        } else {
    
        setTimeout(() => {
            this.firstCard.flipped = false;
            this.secondCard.flipped = false;
    
            this.resetTurn();
    
            this.updateUI();
    
        }, 1500);
        }
    }

    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }

    checkWin() {
        this.won = this.cards.every(card => card.matched);
    
        if (this.won) {
        alert("Bravo !");
        }
    }

    flipCard(cardId) {
        if (this.lockBoard) return;
    
        const card = this.cards.find(c => c.getId() === cardId);
    
        if (card.flipped || card.matched) return;
    
        card.flip();
    
        this.updateUI();
    
        if (!this.firstCard) {
        this.firstCard = card;
        return;
        }
    
        this.secondCard = card;
    
        this.checkMatch();
    }

    updateUI() {
        const frame = document.getElementById("game");

        frame.innerHTML = "";

        this.cards.forEach(card => {
            console.log(card);
            const div = document.createElement("div");

            div.dataset.cardId = card.getId();

            div.className = card.flipped || card.matched ? "card card-back" : "card card-back";

            div.addEventListener("click", () => {
                this.flipCard(card.getId());
            });

            setTimeout(() => { div.className = card.flipped || card.matched ? "card card-back half-flip" : "card card-back flip";}, 1);

            setTimeout(() => { div.className = card.flipped || card.matched ? "card card-front final-flip" : "card card-back flip"; 
            div.innerHTML = card.flipped || card.matched ? `<div class="card-content final-flip ${card.getSuit() === '♥' || card.getSuit() === '♦' ? 'text-red' : 'text-black'}">${card.getSymbol()}</div>` : `<div class="card-content"></div>`;

            }, 500);

            frame.appendChild(div);
        });
    }
}
