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
let solde = 100;
const coutMise = 10;


function obtenirMultiplicateur(symboleCherche) {
    const element = possibilité.find(item => item.symbole === symboleCherche);
        return element ? element.multiplicateur : 0;}

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

             if (solde < coutMise) {
                messageStatut.textContent = "Vous n'avez pas assez de pièces pour jouer !";
                boutonRecharge.style.display = "inline"; 
                return;
            }
            solde -= coutMise;
            soldePieces.textContent = solde;
            boutonRecharge.style.display = "none";

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
                    const multiplicateur = obtenirMultiplicateur(symbole1);
                    const gain = coutMise * multiplicateur;
                    solde += gain;
                    messageStatut.textContent = "La roulette s'est arrêtée ! Grande victoire (3 identiques) !";
                }
                else if (symbole1 === symbole2 || symbole2 === symbole3 || symbole1 === symbole3) {
                    const gain = coutMise; // Regagne sa mise
                    solde += gain;
                    messageStatut.textContent = "La roulette s'est arrêtée ! Petite victoire (2 identiques) !";
                }
                else if (symbole1 === "🔔" || symbole2 === "🔔" || symbole3 === "🔔") {
                    const multiplicateurCloche = obtenirMultiplicateur("🔔"); 
                    const gain = Math.floor((coutMise * multiplicateurCloche) / 3); 
                    solde += gain;
                    messageStatut.textContent = "La roulette s'est arrêtée ! Victoire Cloche (Au moins une cloche 🔔) !";
                }
                else {
                    messageStatut.textContent = "La roulette s'est arrêtée ! Perdu !";
                }
                soldePieces.textContent = solde;
                if (solde < coutMise) {
                    boutonRecharge.style.display = "inline";
                }
                
                e.disabled = false;

            }, 2000);
        }
        boutonLevier.addEventListener("click", e => jouerRoulette(e.target));