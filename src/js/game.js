const difficulties = { // ill see for a custome one
    easy: 8,
    medium: 16,
    hard: 24
};

class Game {

    Constructor(cardCount = 8) {
        this.won = false;

        this.firstCard = null;
        this.secondCard = null;

        this.lockBoard = false;
        
        this.deck = new Deck();
        this.deck.shuffle();

        const pairCount = cardCount / 2;

        const selectedCards = this.deck.cards.slice(0, pairCount);

        this.cards = [...selectedCards, ...selectedCards];

        this.cards.forEach((card, index) => {
            card.setId(index);
        });

        this.cards = this.shuffle(this.cards);
    }

    checkMatch() {
        this.lockBoard = true;
  
        const isMatch = this.firstCard.symbol === this.secondCard.symbol;
    
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
    
        }, 1000);
        }
    }

    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }

    checkWin() {
        this.won = this.cards.every(card => card.matched);
    
        if (won) {
        alert("Bravo !");
        }
    }

    updateUI() {
        const game = document.getElementById("game");

        game.innerHTML = "";

        cards.forEach(card => {
            const div = document.createElement("div");

            div.className = card.flipped || card.matched ? "card card-back half-flip" : "card card-back";

            div.innerHTML = card.flipped || card.matched ? `<div class="card-content">${card.symbol}</div>` : `<div class="card-content"></div>`;

            div.addEventListener("click", () => {
                flipCard(card.id);
            });

            setTimeout(() => { div.className = card.flipped || card.matched ? "card card-front final-flip" : "card card-back flip"; }, 500);

            game.appendChild(div);
        });
    }

    start(difficulty) {
        while (!this.won){
            const cardCount = difficulties[difficulty];
            
            this.cards = this.createGame(cardCount);
            
            this.resetTurn();
            
            this.updateUI();
        }
    }
}