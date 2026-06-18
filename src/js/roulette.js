// ══════════════════════════════════════════
//  DONNÉES DU JEU
// ══════════════════════════════════════════

const possibilité = [
    { symbole: "7️⃣", poids: 3,  multiplicateur: 100 },
    { symbole: "💎", poids: 5,  multiplicateur: 50  },
    { symbole: "💰", poids: 3,  multiplicateur: 25  },
    { symbole: "🍀", poids: 10, multiplicateur: 10  },
    { symbole: "🔔", poids: 1,  multiplicateur: 5   },
    { symbole: "🍒", poids: 19, multiplicateur: 4   },
    { symbole: "🍋", poids: 3,  multiplicateur: 3   },
    { symbole: "🥐", poids: 20, multiplicateur: 2   }
];

// Liste de tous les symboles (utilisée pendant l'animation)
const tousLesSymboles = possibilité.map(p => p.symbole);

// ══════════════════════════════════════════
//  ÉLÉMENTS DU DOM
// ══════════════════════════════════════════

const boutonLevier   = document.getElementById("boutonLevier");
const messageStatut  = document.getElementById("messageStatut");
const AfficheResultat = document.getElementById("AfficheResultat");
const soldePieces    = document.getElementById("soldePieces");
const inputMise      = document.getElementById("inputMise");
const aperçuGains    = document.getElementById("aperçuGains");
const zoneRecharge   = document.getElementById("zoneRecharge");
const boutonRecharge = document.getElementById("boutonRecharge");
const levierPoignee  = document.getElementById("levierPoignee");

// Les 3 cases des rouleaux
const sym1 = document.getElementById("sym1");
const sym2 = document.getElementById("sym2");
const sym3 = document.getElementById("sym3");

let solde = 100;

// ══════════════════════════════════════════
//  UTILITAIRES
// ══════════════════════════════════════════

// Affiche le gain maximum possible selon la mise actuelle
function mettreAJourAperçu() {
    const mise = parseInt(inputMise.value);
    if (!isNaN(mise) && mise > 0) {
        aperçuGains.textContent = `(Gain max : ${mise * 100} 🪙 avec 7️⃣7️⃣7️⃣)`;
    } else {
        aperçuGains.textContent = "(Mise invalide)";
    }
}

// Retourne le multiplicateur d'un symbole donné
function obtenirMultiplicateur(symbole) {
    const item = possibilité.find(p => p.symbole === symbole);
    return item ? item.multiplicateur : 0;
}

// Tire un symbole au hasard en tenant compte des poids
function tirerSymbole() {
    const totalPoids = possibilité.reduce((acc, p) => acc + p.poids, 0);
    let rand = Math.floor(Math.random() * totalPoids);
    for (const item of possibilité) {
        rand -= item.poids;
        if (rand < 0) return item.symbole;
    }
}

// ══════════════════════════════════════════
//  ANIMATION D'UN ROULEAU
// ══════════════════════════════════════════

/*
 * Fait tourner un rouleau pendant `dureeMs` millisecondes,
 * puis s'arrête sur `symboleFinal`.
 * Appelle `callback` quand c'est terminé.
 *
 * Principe : on change le symbole toutes les X ms.
 * X commence petit (rapide) et grandit vers la fin (ralentissement).
 */
function tournerRouleau(elementSymbole, fenetre, symboleFinal, dureeMs, callback) {
    const debut = Date.now();
    let delai = 60; // vitesse initiale en ms

    // Active la classe CSS de flou pendant la rotation
    elementSymbole.classList.add("tourne");
    fenetre.classList.remove("gagnant");

    function prochainSymbole() {
        const ecoule = Date.now() - debut;
        const progression = ecoule / dureeMs; // 0.0 → 1.0

        // Ralentissement : à partir de 60% du temps, le délai augmente
        if (progression > 0.6) {
            const t = (progression - 0.6) / 0.4; // 0.0 → 1.0 dans la phase de ralenti
            delai = 60 + t * t * 300;             // de 60ms jusqu'à 360ms
        }

        // Affiche un symbole aléatoire pendant la rotation
        elementSymbole.textContent = tousLesSymboles[Math.floor(Math.random() * tousLesSymboles.length)];

        if (ecoule >= dureeMs) {
            // Arrêt : on affiche le bon symbole et on enlève le flou
            elementSymbole.classList.remove("tourne");
            elementSymbole.textContent = symboleFinal;
            if (callback) callback();
        } else {
            // Prochain tick
            setTimeout(prochainSymbole, delai);
        }
    }

    prochainSymbole();
}

// ══════════════════════════════════════════
//  JEU PRINCIPAL
// ══════════════════════════════════════════

function jouerRoulette() {
    const coutMise = parseInt(inputMise.value);

    // Vérifications de base
    if (isNaN(coutMise) || coutMise <= 0) {
        messageStatut.textContent = "Veuillez entrer une mise valide (min 1 pièce) !";
        return;
    }
    if (solde < coutMise) {
        messageStatut.textContent = "Pas assez de pièces !";
        zoneRecharge.style.display = "flex";
        return;
    }

    // Déduire la mise et bloquer les boutons
    solde -= coutMise;
    soldePieces.textContent = solde;
    boutonLevier.disabled = true;
    inputMise.disabled = true;
    zoneRecharge.style.display = "none";
    AfficheResultat.textContent = "";
    AfficheResultat.style.color = "";

    // Retirer les effets de victoire précédents
    document.querySelectorAll(".rouleau-fenetre").forEach(f => f.classList.remove("gagnant"));

    // Tirer les 3 symboles à l'avance (on les connaît mais on les cache pendant l'animation)
    const symbole1 = tirerSymbole();
    const symbole2 = tirerSymbole();
    const symbole3 = tirerSymbole();

    messageStatut.textContent = "🎰 Les rouleaux tournent...";

    // Récupère les fenêtres des rouleaux
    const fenetres = document.querySelectorAll(".rouleau-fenetre");

    // Démarre le son de rotation (ticker) — stopTourne() l'arrêtera
    const stopTourne = sonTourne();

    // Les 3 rouleaux partent EN MÊME TEMPS mais s'arrêtent à des moments différents
    tournerRouleau(sym1, fenetres[0], symbole1, 1400, () => {
        sonArret();
        messageStatut.textContent = "⏳ Encore deux...";
    });
    tournerRouleau(sym2, fenetres[1], symbole2, 2200, () => {
        sonArret();
        messageStatut.textContent = "⏳ Dernier rouleau...";
    });
    tournerRouleau(sym3, fenetres[2], symbole3, 3100, () => {
        stopTourne(); // arrête le son de rotation
        sonArret();

                // ── Calcul du résultat (logique originale inchangée) ──
                if (symbole1 === symbole2 && symbole2 === symbole3) {
                    const multiplicateur = obtenirMultiplicateur(symbole1);
                    const gain = coutMise * multiplicateur;
                    solde += gain;
                    messageStatut.textContent = `🎉 JACKPOT ! 3 × ${symbole1} — Gain : ${gain} pièces !`;
                    AfficheResultat.textContent = `+${gain} 🪙`;
                    AfficheResultat.style.color = "#ffd700";
                    fenetres.forEach(f => f.classList.add("gagnant"));
                    sonJackpot(); // fanfare + pluie de pièces
                }
                else if (symbole1 === symbole2 || symbole2 === symbole3 || symbole1 === symbole3) {
                    const gain = coutMise;
                    solde += gain;
                    messageStatut.textContent = `✨ 2 identiques ! Mise récupérée : ${gain} pièces.`;
                    AfficheResultat.textContent = `+${gain} 🪙`;
                    AfficheResultat.style.color = "#ffd700";
                    sonGain(); // bips de pièces
                }
                else if (symbole1 === "🔔" || symbole2 === "🔔" || symbole3 === "🔔") {
                    const multiplicateurCloche = obtenirMultiplicateur("🔔");
                    const gain = Math.floor((coutMise * multiplicateurCloche) / 3);
                    solde += gain;
                    messageStatut.textContent = `🔔 Cloche ! Petit gain : ${gain} pièces.`;
                    AfficheResultat.textContent = `+${gain} 🪙`;
                    AfficheResultat.style.color = "#ffd700";
                    sonGain();
                }
                else {
                    messageStatut.textContent = "❌ Perdu ! Retentez votre chance.";
                    AfficheResultat.textContent = `-${coutMise} 🪙`;
                    AfficheResultat.style.color = "#ff4444";
                    sonPerdu(); // son descendant
                }

                soldePieces.textContent = solde;

                // Réactiver les boutons
                boutonLevier.disabled = false;
                inputMise.disabled = false;

                // Afficher la recharge si plus assez de pièces
                if (solde < coutMise || solde <= 0) {
                    zoneRecharge.style.display = "flex";
                }
    });
}

// ══════════════════════════════════════════
//  MANIVELLE
// ══════════════════════════════════════════

// Quand on clique sur la manivelle : animation + lancement du jeu
levierPoignee.addEventListener("click", () => {
    if (boutonLevier.disabled) return;
    sonLevier(); // son mécanique du levier
    levierPoignee.classList.add("tire");
    setTimeout(() => levierPoignee.classList.remove("tire"), 600);
    jouerRoulette();
});

boutonLevier.addEventListener("click", () => {
    sonLevier();
    levierPoignee.classList.add("tire");
    setTimeout(() => levierPoignee.classList.remove("tire"), 600);
    jouerRoulette();
});

// ══════════════════════════════════════════
//  RECHARGE
// ══════════════════════════════════════════

boutonRecharge.addEventListener("click", () => {
    const valeur = parseInt(document.getElementById("inputMontantRecharge").value);
    if (isNaN(valeur) || valeur < 10) {
        document.getElementById("inputMontantRecharge").style.borderColor = "#ff4444";
        return;
    }
    solde = valeur;
    soldePieces.textContent = solde;
    zoneRecharge.style.display = "none";
    AfficheResultat.textContent = "";
    messageStatut.textContent = `💰 Solde rechargé à ${valeur} pièces ! Bonne chance !`;
    document.querySelectorAll(".rouleau-fenetre").forEach(f => f.classList.remove("gagnant"));
    mettreAJourAperçu();
});

// ══════════════════════════════════════════
//  SOLDE DE DÉPART
// ══════════════════════════════════════════

document.getElementById("btnAppliquer").addEventListener("click", () => {
    const valeur = parseInt(document.getElementById("inputSoldeDepart").value);
    if (isNaN(valeur) || valeur < 10) return;
    solde = valeur;
    soldePieces.textContent = solde;
    zoneRecharge.style.display = "none";
    messageStatut.textContent = `✅ Solde défini à ${valeur} pièces.`;
    mettreAJourAperçu();
});

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════

inputMise.addEventListener("input", mettreAJourAperçu);
mettreAJourAperçu();
