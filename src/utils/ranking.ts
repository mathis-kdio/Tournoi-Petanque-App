import { TypeTournoi } from "@/types/enums/typeTournoi";
import { Match } from "@/types/interfaces/match";

export const ranking = (listeMatchs: Match[]) => {
  if (listeMatchs != undefined) {
    let optionsTournoi = listeMatchs[listeMatchs.length - 1];
    let nbPtVictoire = optionsTournoi.nbPtVictoire ? optionsTournoi.nbPtVictoire : 13;
    let victoires = victoiresPointsCalc(listeMatchs, optionsTournoi, nbPtVictoire);

    if (optionsTournoi.typeTournoi == TypeTournoi.MULTICHANCES) {
      //Classement pour les tournois de type Multi-Chances
      return rankingMuliChances(listeMatchs, optionsTournoi, nbPtVictoire, victoires);
    } else {
      //Classement pour les autres tournois
      return rankingClassic(victoires);
    }
  }
}

const rankingClassic = (victoires) => {
  victoires.sort((a, b) => a.victoires === b.victoires ? b.points - a.points : b.victoires - a.victoires);

  let position = 1;
  for (let i = 0; i < victoires.length; i++) {
    if (i > 0 && victoires[i-1].victoires === victoires[i].victoires && victoires[i-1].points === victoires[i].points) {
      victoires[i].position = victoires[i-1].position;
    } else {
      victoires[i].position = position;
    }
    position++;
  }
  return victoires;
}

const factorial = n => {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

const rankingMuliChances = (listeMatchs: Match[], optionsTournoi, nbPtVictoire: number, victoires) => {
  for (let i = 0; i < victoires.length; i++) {
    let position = 1;
    for (let j = 0; j < optionsTournoi.nbMatchs; j++) {
      if (listeMatchs[j].equipe[0].includes(i) && listeMatchs[j].score1) {
        if (listeMatchs[j].score1 >= nbPtVictoire) {
          position += factorial(optionsTournoi.nbTours + 1 - listeMatchs[j].manche); 
        }
      }
      if (listeMatchs[j].equipe[1].includes(i) && listeMatchs[j].score2) {
        if (listeMatchs[j].score2 >= nbPtVictoire) {
          position += factorial(listeMatchs[j].manche); 
        }
      }
    }
    victoires[i].position = position;
  }

  victoires.sort((a, b) => b.position - a.position).forEach((value, index) => victoires[index].position = index + 1);

  return victoires;
}

const victoiresPointsCalc = (listeMatchs: Match[], optionsTournoi, nbPtVictoire: number) => {
  let listeJoueurs = optionsTournoi.listeJoueurs;
  let victoires = [];
  for (let i = 0; i < listeJoueurs.length; i++) {
    let nbVictoire = 0;
    let nbPoints = 0;
    let nbMatchs = 0;
    for (let j = 0; j < optionsTournoi.nbMatchs; j++) {
      if (listeMatchs[j].equipe[0].includes(i) && listeMatchs[j].score1) {
        if (listeMatchs[j].score1 >= nbPtVictoire) {
          nbVictoire++;
          nbPoints += nbPtVictoire - listeMatchs[j].score2;
        } else {
          nbPoints -= nbPtVictoire - listeMatchs[j].score1;
        }
        nbMatchs++;
      }
      if (listeMatchs[j].equipe[1].includes(i) && listeMatchs[j].score2) {
        if (listeMatchs[j].score2 >= nbPtVictoire) {
          nbVictoire++;
          nbPoints += nbPtVictoire - listeMatchs[j].score1;
        } else {
          nbPoints -= nbPtVictoire - listeMatchs[j].score2;
        }
        nbMatchs++;
      }
    }
    victoires[i] = {joueurId: i, victoires: nbVictoire, points: nbPoints, nbMatchs: nbMatchs, position: undefined};
  }

  return victoires;
}