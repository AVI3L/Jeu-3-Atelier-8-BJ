const possibilité = ["7️⃣", "💎", "🍒","💰","🍀","🔔","🍋","🥐"];
const boutonLevier = document.getElementById("boutonLevier");
const messageStatut = document.getElementById("messageStatut");
const AfficheResultat = document.getElementById("AfficheResultat");

        function jouerRoulette(e) {
            e.disabled = true;
            messageStatut.textContent = "La roulette tourne...";
            AfficheResultat.textContent = "";
            setTimeout(() => {
                const index1 = Math.floor(Math.random() * possibilité.length);
                const index2 = Math.floor(Math.random() * possibilité.length);
                const index3 = Math.floor(Math.random() * possibilité.length);
                
                const resultatGagnant = `${possibilité[index1]} ${possibilité[index2]} ${possibilité[index3]}`;
                
                messageStatut.textContent = "La roulette s'est arrêtée !";
                AfficheResultat.textContent = resultatGagnant;

                e.disabled = false;

            }, 2000);
        }
        boutonLevier.addEventListener("click", e => jouerRoulette(e.target));