const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let lastid = 0;

class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.flipped = false;
        this.matched = false;
    }

    flip() {
        this.flipped = !this.flipped;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    getId(){
        return this.id;
    }

    getSymbol() {
        return `${this.value}${this.suit}`;
    }

    getSuit() {
        return this.suit;
    }
    
    getValue() {
        return this.value;
    }
}

class Deck {
    constructor() {
        /** @type {Card[]} */
        this.cards = [];
        this.createDeck();
    }

    createDeck() {
        for (const suit of suits) {
            for (const value of values) {
                this.cards.push(new Card(value, suit));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    findFlipped() {
        return this.cards.filter(card => card.flipped);
    }

    parse(Cards){
        this.cards = Cards.map(card => {
            const newCard = new Card(card.value, card.suit);
            newCard.flipped = card.flipped;
            newCard.matched = card.matched;
            newCard.setId(card.id);
            return newCard;
        });
        return this;
    }

    
}