
        const possibilités = [
            { symbole: "7️⃣", poids: 3,  multiplicateur: 100 },
            { symbole: "💎", poids: 5,  multiplicateur: 50  },
            { symbole: "💰", poids: 7,  multiplicateur: 25  },
            { symbole: "🍀", poids: 12, multiplicateur: 10  },
            { symbole: "🔔", poids: 15, multiplicateur: 5   },
            { symbole: "🍒", poids: 20, multiplicateur: 4   },
            { symbole: "🍋", poids: 22, multiplicateur: 3   },
            { symbole: "🥐", poids: 25, multiplicateur: 2   }
        ];

        document.addEventListener("DOMContentLoaded", () => {
            
            const boutonLevier   = document.getElementById("boutonLevier");
            const levierPoignee  = document.getElementById("levierPoignee");
            const messageStatut  = document.getElementById("messageStatut");
            const AfficheResultat = document.getElementById("AfficheResultat");
            const soldePieces    = document.getElementById("soldePieces");
            const inputMise      = document.getElementById("inputMise");
            const zoneRecharge   = document.getElementById("zoneRecharge");
            const boutonRecharge = document.getElementById("boutonRecharge");
            
            const btnBetPlus     = document.getElementById("btnBetPlus");
            const btnMaxBet      = document.getElementById("btnMaxBet");

            const fenetres = [
                document.getElementById("fenetre1"),
                document.getElementById("fenetre2"),
                document.getElementById("fenetre3")
            ];
            const rouleau1 = document.getElementById("rouleau1");
            const rouleau2 = document.getElementById("rouleau2");
            const rouleau3 = document.getElementById("rouleau3");

            let solde = 500;
            let enCoursDeSpin = false;

            if (!boutonLevier || !rouleau1 || !rouleau2 || !rouleau3) {
                console.error("❌ Roulette.js : Éléments HTML introuvables !");
                return;
            }

            function tirerSymbole() {
                const totalPoids = possibilités.reduce((acc, p) => acc + p.poids, 0);
                let rand = Math.floor(Math.random() * totalPoids);
                for (const item of possibilités) {
                    rand -= item.poids;
                    if (rand < 0) return item.symbole;
                }
                return possibilités[possibilités.length - 1].symbole;
            }

            function obtenirMultiplicateur(symbole) {
                const item = possibilités.find(p => p.symbole === symbole);
                return item ? item.multiplicateur : 0;
            }

            function animerRouleau(elementBande, symboleFinal, dureeTotale, callback) {
                if (!elementBande) return;
                const debut = Date.now();
                let delai = 45;
                
                elementBande.classList.add("spinning");

                function tourner() {
                    const ecoule = Date.now() - debut;
                    const progression = ecoule / dureeTotale;

                    if (progression > 0.65) {
                        const t = (progression - 0.65) / 0.35;
                        delai = 45 + t * t * 240;
                    }

                    const indexHasard = Math.floor(Math.random() * possibilités.length);
                    elementBande.textContent = possibilités[indexHasard].symbole;

                    if (ecoule >= dureeTotale) {
                        elementBande.classList.remove("spinning");
                        elementBande.textContent = symboleFinal;
                        if (callback) callback();
                    } else {
                        setTimeout(tourner, delai);
                    }
                }

                tourner();
            }

            function lancerLeSpin() {
                if (enCoursDeSpin) return;

                const coutMise = parseInt(inputMise.value);

                if (isNaN(coutMise) || coutMise <= 0) {
                    messageStatut.textContent = "MISE INVALIDE";
                    return;
                }
                if (solde < coutMise) {
                    messageStatut.textContent = "SOLDE INSUFFISANT";
                    zoneRecharge.style.display = "flex";
                    return;
                }

                enCoursDeSpin = true;
                solde -= coutMise;
                soldePieces.textContent = solde;
                
                boutonLevier.disabled = true;
                inputMise.disabled = true;
                zoneRecharge.style.display = "none";
                AfficheResultat.textContent = "";

                fenetres.forEach(f => f.classList.remove("winner-glow"));

                const symbole1 = tirerSymbole();
                const symbole2 = tirerSymbole();
                const symbole3 = tirerSymbole();

                messageStatut.textContent = "ROULEAUX EN ROUTE...";

                animerRouleau(rouleau1, symbole1, 1400, () => {
                    messageStatut.textContent = "ROULEAU 1 PRÊT";
                });

                animerRouleau(rouleau2, symbole2, 2100, () => {
                    messageStatut.textContent = "ROULEAU 2 PRÊT";
                });

                animerRouleau(rouleau3, symbole3, 2800, () => {
                    calculerResultat(symbole1, symbole2, symbole3, coutMise);
                });
            }

            function calculerResultat(s1, s2, s3, miseActive) {
                let gain = 0;
                let estJackpot = false;

                if (s1 === s2 && s2 === s3) {
                    const mult = obtenirMultiplicateur(s1);
                    gain = miseActive * mult;
                    if (s1 === "7️⃣") estJackpot = true;
                    
                    messageStatut.textContent = estJackpot ? "★ JACKPOT SUPRÊME ★" : "SUPER ALIGNEMENT !";
                    AfficheResultat.textContent = `+${gain} PIÈCES`;
                    AfficheResultat.style.color = "#ffd700";
                    
                    fenetres.forEach(f => f.classList.add("winner-glow"));
                } 
                else if (s1 === s2 || s2 === s3 || s1 === s3) {
                    gain = miseActive;
                    messageStatut.textContent = "PAIRE ALIGNÉE !";
                    AfficheResultat.textContent = `REMBOURSÉ (+${gain})`;
                    AfficheResultat.style.color = "#00ffcc";
                } 
                else if (s1 === "🔔" || s2 === "🔔" || s3 === "🔔") {
                    const multiplicateurCloche = obtenirMultiplicateur("🔔");
                    gain = Math.floor((miseActive * multiplicateurCloche) / 3); 
                    messageStatut.textContent = "TINTEMENT DE CLOCHE !";
                    AfficheResultat.textContent = `BONUS (+${gain})`;
                    AfficheResultat.style.color = "#ffaa00";
                } 
                else {
                    messageStatut.textContent = "ESSAYEZ ENCORE !";
                    AfficheResultat.textContent = `-${miseActive} JETONS`;
                    AfficheResultat.style.color = "#ff3300";
                }

                solde += gain;
                soldePieces.textContent = solde;

                boutonLevier.disabled = false;
                inputMise.disabled = false;
                enCoursDeSpin = false;

                if (solde <= 0 || solde < parseInt(inputMise.value)) {
                    zoneRecharge.style.display = "flex";
                }
            }

            boutonLevier.addEventListener("click", lancerLeSpin);
            if (levierPoignee) {
                levierPoignee.addEventListener("click", lancerLeSpin);
            }

            if (btnBetPlus) {
                btnBetPlus.addEventListener("click", () => {
                    if (enCoursDeSpin) return;
                    let current = parseInt(inputMise.value) || 0;
                    inputMise.value = current + 10;
                });
            }

            if (btnMaxBet) {
                btnMaxBet.addEventListener("click", () => {
                    if (enCoursDeSpin) return;
                    inputMise.value = solde;
                });
            }

            if (boutonRecharge) {
                boutonRecharge.addEventListener("click", () => {
                    const montant = parseInt(document.getElementById("inputMontantRecharge").value);
                    if (isNaN(montant) || montant < 10) return;
                    solde = montant;
                    soldePieces.textContent = solde;
                    zoneRecharge.style.display = "none";
                    AfficheResultat.textContent = "";
                    messageStatut.textContent = "CRÉDITS CHARGÉS !";
                });
            }

            const btnAppliquer = document.getElementById("btnAppliquer");
            if (btnAppliquer) {
                btnAppliquer.addEventListener("click", () => {
                    const inputSoldeDepart = document.getElementById("inputSoldeDepart");
                    if (!inputSoldeDepart) return;
                    const depart = parseInt(inputSoldeDepart.value);
                    if (isNaN(depart) || depart < 10) return;
                    solde = depart;
                    soldePieces.textContent = solde;
                    zoneRecharge.style.display = "none";
                    messageStatut.textContent = "COMPTE CONFIGURÉ";
                });
            }

            function initialiserMachine() {
                rouleau1.textContent = "7️⃣";
                rouleau2.textContent = "🍒";
                rouleau3.textContent = "🍀";
            }

            initialiserMachine();
        });