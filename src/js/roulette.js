const possibilité = [
    { symbole: "7️⃣", poids: 3, multiplicateur: 100 },
    { symbole: "💎", poids: 5, multiplicateur: 50 },
    { symbole: "💰", poids: 3, multiplicateur: 25 },
    { symbole: "🍀", poids: 10, multiplicateur: 10 },
    { symbole: "🔔", poids: 1, multiplicateur: 5 },
    { symbole: "🍒", poids: 19, multiplicateur: 4 },
    { symbole: "🍋", poids: 3, multiplicateur: 3 },
    { symbole: "🥐", poids: 20, multiplicateur: 2 }];
const boutonLevier = document.getElementById("boutonLevier");
const messageStatut = document.getElementById("messageStatut");
const AfficheResultat = document.getElementById("AfficheResultat");
const soldePieces = document.getElementById("soldePieces");
const boutonRecharge = document.getElementById("boutonRecharge");
const inputMise = document.getElementById("inputMise");
const aperçuGains = document.getElementById("aperçuGains");


let solde = 100;

function mettreAJourAperçu() {
    const miseActuelle = parseInt(inputMise.value);
    if (!isNaN(miseActuelle) && miseActuelle > 0) {
        const gainMax = miseActuelle * 100; // Le symbole '7' multiplie par 100
        aperçuGains.textContent = `(Gain max possible : ${gainMax} pièces avec 7️⃣ 7️⃣ 7️⃣)`;
    } else {
        aperçuGains.textContent = `(Entrez une mise valide)`;
    }
}

inputMise.addEventListener("input", mettreAJourAperçu);

function obtenirMultiplicateur(symboleCherche) {
    const element = possibilité.find(item => item.symbole === symboleCherche);
    return element ? element.multiplicateur : 0;
}

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

    const coutMise = parseInt(inputMise.value);

    if (isNaN(coutMise) || coutMise <= 0) {
                messageStatut.textContent = "Veuillez entrer une mise valide (au moins 1 pièce) !";
                return;
            }

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
    inputMise.disabled = true; 
    
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
            const gain = coutMise;
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
        inputMise.disabled = false;

    }, 2000);

    boutonRecharge.addEventListener("click", () => {
        solde = 100;
        soldePieces.textContent = solde;
        messageStatut.textContent = "Crédits rechargés ! Vous revoilà dans le jeu.";
        boutonRecharge.style.display = "none";
        mettreAJourAperçu();
    });
}
boutonLevier.addEventListener("click", e => jouerRoulette(e.target)); 