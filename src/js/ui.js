function updateUI() {
    const game = document.getElementById("game");
  
    game.innerHTML = "";
  
    cards.forEach(card => {
      const div = document.createElement("div");
  
      div.className = "card";
  
      div.textContent =
        card.flipped || card.matched
          ? card.symbol
          : "?";
  
      div.addEventListener("click", () => {
        flipCard(card.id);
      });
  
      game.appendChild(div);
    });
}
