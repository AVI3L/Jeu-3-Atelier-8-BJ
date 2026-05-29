function updateUI() {
    const game = document.getElementById("game");

    game.innerHTML = "";

    cards.forEach(card => {
        const div = document.createElement("div");

        div.className = "card";

        div.innerHTML = card.flipped || card.matched ? `<div class="card-content">${card.symbol}</div>` : `<div class="card-content">?</div>`;

        div.addEventListener("click", () => {
            flipCard(card.id);
        });

        game.appendChild(div);
    });
}