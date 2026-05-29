const possibilité = ["Résultat 1 :7", "Résultat 2 : Diamant", "Résultat 3: Cerise "];
const boutonLevier = document.getElementById("boutonLevier");
const messageStatut = document.getElementById("messageStatut");
const AfficheResultat = document.getElementById("AfficheResultat");

        function jouerRoulette() {
            boutonLevier.disabled = true;
            messageStatut.textContent = "La roulette tourne...";
            AfficheResultat.textContent = "";
            setTimeout(() => {
                const index1 = Math.floor(Math.random() * possibilité.length);
                const index2 = Math.floor(Math.random() * possibilité.length);
                const index3 = Math.floor(Math.random() * possibilité.length);


                const resultatGagnant = possibilité[index1];
                const resultatGagnant = possibilité[index2];
                const resultatGagnant = possibilité[index3];

                messageStatut.textContent = "La roulette s'est arrêtée !";
                AfficheResultat.textContent = resultatGagnant;

                boutonLevier.disabled = false;

            }, 2000);
        }
        boutonLevier.addEventListener("click", jouerRoulette);