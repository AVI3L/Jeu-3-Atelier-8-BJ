const difficulties = {
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

        // console.log(newCards);

        this.moves = 0;
        this.matches = 0;
        this.combo = 0;
        this.totalPairs = cardCount / 2;
        this.time = 0;
        this.timer = null;

        document.getElementById("score").textContent = "0";
        document.getElementById("timer").textContent = "0";
        document.getElementById("combo").textContent = "x0";
        document.getElementById("pairs").textContent = 0;
        document.getElementById("totalPairs").textContent = this.totalPairs;

        this.startTimer();

        this.combo = 0;

        this.winSong = new Audio("../src/audio/You Win !.mp3");

        this.flipSound = new Audio("../src/audio/Flip.wav");

        this.comboSounds = [
            new Audio("../src/audio/ComboA.wav"),
            new Audio("../src/audio/ComboCis.wav"),
            new Audio("../src/audio/ComboDis.wav"),
            new Audio("../src/audio/ComboF.wav"),
            new Audio("../src/audio/ComboG.wav"),
            new Audio("../src/audio/ComboGH.wav"),
            new Audio("../src/audio/ComboH.wav"),
            new Audio("../src/audio/ComboCisH.wav"),
            new Audio("../src/audio/ComboDisH.wav"),
            new Audio("../src/audio/ComboFH.wav"),
            new Audio("../src/audio/ComboFinnal.wav")
        ];

        this.flipSound.volume = 0.25;

        this.deck = new Deck().parse(newCards);

        this.deck.shuffle();

        this.cards = this.deck.cards;

        this.resetTurn();

        this.renderBoard();
    }

    startTimer() {
        this.stopTimer();

        this.timer = setInterval(() => {
            this.time++;
            document.getElementById("timer").textContent = this.time;
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    checkMatch() {
        this.lockBoard = true;

        const isMatch = this.firstCard.getSymbol() === this.secondCard.getSymbol();

        if (isMatch) {
            this.matches++;
            this.combo++;
            this.playCombo();

            document.getElementById("pairs").textContent = this.matches;
            document.getElementById("combo").textContent = `x${this.combo}`;

            this.firstCard.matched = true;
            this.secondCard.matched = true;

            this.resetTurn();

            this.checkWin();

        } else {
            this.combo = 0;
            document.getElementById("combo").textContent = "x0";

            setTimeout(() => {
                this.firstCard.flipped = false;
                this.secondCard.flipped = false;

                this.resetTurn();

                this.updateUI();

            }, 1500);
        }

        const combo = document.querySelector(".combo");

        combo.classList.toggle("active", this.combo >= 3);
    }

    playCombo() {
        const sound = this.comboSounds[
            Math.min(this.combo - 1, this.comboSounds.length - 1)
        ];

        sound.volume = 0.25;

        sound.currentTime = 0;
        sound.play();
    }

    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }

    checkWin() {
        this.won = this.cards.every(card => card.matched);

        if (this.won) {
            this.stopTimer();

            this.winSong.currentTime = 0;
            this.winSong.play();

            setTimeout(() => {
                alert("Bravo !");
            }, 1000);
        }
    }

    flipCard(cardId) {
        if (this.lockBoard) return;

        const card = this.cards.find(c => c.getId() === cardId);

        if (card.flipped || card.matched) return;

        card.flip();

        this.flipSound.currentTime = 0;
        this.flipSound.play();

        this.moves++;
        document.getElementById("score").textContent = this.moves;

        this.updateCard(card);

        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }

        this.secondCard = card;

        this.checkMatch();
    }

    renderBoard() {
        const frame = document.getElementById("game");
        frame.innerHTML = "";

        this.cards.forEach(card => {
            const div = document.createElement("div");

            div.className = "card card-back";
            div.dataset.cardId = card.getId();

            div.addEventListener("click", () => {
                this.flipCard(card.getId());
            });

            frame.appendChild(div);
        });

        this.updateUI();
    }

    updateUI() {
        this.cards.forEach(card => {
            const div = document.querySelector(
                `[data-card-id="${card.getId()}"]`
            );

            if (!div) return;

            if (card.flipped || card.matched) {
                div.className = "card card-front final-flip";
                div.innerHTML =
                    `<div class="card-content ${
                    card.getSuit() === "♥" || card.getSuit() === "♦"
                        ? "text-red"
                        : "text-black"
                }">${card.getSymbol()}</div>`;
            } else {
                div.className = "card card-back";
                div.innerHTML = "";
            }
        });
    }

    updateCard(card) {
        const div = document.querySelector(
            `[data-card-id="${card.getId()}"]`
        );

        div.classList.add("half-flip");

        setTimeout(() => {
            div.className = "card card-front final-flip";
            div.innerHTML =
                `<div class="card-content ${
                card.getSuit() === "♥" || card.getSuit() === "♦"
                    ? "text-red"
                    : "text-black"
            }">${card.getSymbol()}</div>`;
        }, 500);
    }

    stopAllSounds() {
        const sounds = [
            this.flipSound,
            this.winSong,
            ...this.comboSounds
        ];

        sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}