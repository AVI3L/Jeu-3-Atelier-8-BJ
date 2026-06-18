function updateUI() {
    const game = document.getElementById("game");

    game.innerHTML = "";

    cards.forEach(card => {
        const div = document.createElement("div");

        div.className = card.flipped || card.matched ? "card card-back half-flip" : "card card-back";

        div.innerHTML = card.flipped || card.matched ? `<div class="card-content">${card.symbol}</div>` : `<div class="card-content"></div>`;

        div.addEventListener("click", () => {
            flipCard(card.id);
        });

        game.appendChild(div);
    });
}