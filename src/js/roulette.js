const possibilité = [
            { symbole: "7️⃣", poids: 3 },
            { symbole: "💎", poids: 5 },
            { symbole: "💰", poids: 3 },
            { symbole: "🍀", poids: 10 },
            { symbole: "🔔", poids: 1 },
            { symbole: "🍒", poids: 19 },
            { symbole: "🍋", poids: 3 },
            { symbole: "🥐", poids: 20 }];
const boutonLevier = document.getElementById("boutonLevier");
const messageStatut = document.getElementById("messageStatut");
const AfficheResultat = document.getElementById("AfficheResultat");


function tirerSymbole() {
            const totalPoids = 64; // Total des poids du tableau
            let rand = Math.floor(Math.random() * totalPoids);
            let cumul = 0;
            
            for (let item of possibilité) {
                cumul += item.poids;
                if (rand < cumul) {
                    return item.symbole;
                }
            }
        }
        function jouerRoulette(e) {
            e.disabled = true;
            messageStatut.textContent = "La roulette tourne...";
            AfficheResultat.textContent = "";
            setTimeout(() => {
                const symbole1 = tirerSymbole();
                const symbole2 = tirerSymbole();
                const symbole3 = tirerSymbole();
                
                const resultatGagnant = `${symbole1} ${symbole2} ${symbole3}`
                
                
                AfficheResultat.textContent = resultatGagnant;
                if (symbole1 === symbole2 && symbole2 === symbole3) {
                    messageStatut.textContent = "La roulette s'est arrêtée ! Gagné !";
                } else {
                    messageStatut.textContent = "La roulette s'est arrêtée ! Perdu !";
                }

                e.disabled = false;

            }, 2000);
        }
        boutonLevier.addEventListener("click", e => jouerRoulette(e.target));