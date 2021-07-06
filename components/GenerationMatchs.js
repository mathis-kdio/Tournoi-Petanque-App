import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native'
import { connect } from 'react-redux'

class GenerationMatchs extends React.Component {
  constructor(props) {
    super(props)
    this.incompatibleMatch = []; //Joueur incompatible pour le match
    this.nonDisponibleManche = []; //Joueur déjà choisi pour la manche
    this.dejaPartenaires = []; //Joueur déjà été partenaires
    this.dejaJouerContre = []; //Joueur déjà joué contre
    this.nbTours = "5"
    this.speciauxIncompatibles = true
    this.jamaisMemeCoequipier = true
    this.eviterMemeAdversaire = true
    this.state = {
      isLoading: true,
      isValid: true,
      isGenerationSuccess: true,
      erreurSpeciaux: false,
      erreurMemesEquipes: false
    }
  }

  _ajoutMatchs = (matchs) => {
    this._supprimerMatchs();
    const action = { type: "AJOUT_MATCHS", value: matchs }
    this.props.dispatch(action);
  }

  _supprimerMatchs () {
    const action = { type: "SUPPR_MATCHS" }
    this.props.dispatch(action)
  }

  componentDidMount() {
    setTimeout(() => {
      this._lanceurGeneration();
    }, 1000);
  }

  _displayListeMatch () {
    this.props.navigation.navigate('ListeMatchsInscription');
  }


  /*
  //Test si joueur randomNum déjà affecté pour cette manche
  _testNonDisponible = (randomNum) => {
    const excluIndex = this.nonDisponibleManche.findIndex(item => item === randomNum);
    if (excluIndex !== -1) {
      this.incompatibleMatch.push(randomNum);
      return 1;
    }
    return 0
  }

  _testNonCompatible = (randomNum) => {
    const excluIndex = this.incompatibleMatch.findIndex(item => item === randomNum);
    if (excluIndex !== -1) {
      console.log('Joueur déjà marqué incompatible pour ce match avec rand=', randomNum);
      return 1;
    }
    return 0
  }

  //Test si le 1er joueur déjà choisi et le nouveau joueur sont tout les 2 femme/enfant
  _testSpeciaux = (randomNum, partenaire) => {
    let joueurSpecial1 = this.props.listeJoueurs.find(item => item.id === partenaire);
    let joueurSpecial2 = this.props.listeJoueurs.find(item => item.id === randomNum);
    if (joueurSpecial1.special === true && joueurSpecial2.special === true) {
      console.log('Joueurs sont spéciaux: j1: ', randomNum, '  j2: ', partenaire);
      this.incompatibleMatch.push(randomNum);
      return 1;
    }
    return 0;
  }
  
  //Test si les joueurs ont déjà joués en tant que partenaires dans les manches précédentes
  _testDejaEtePartenaires = (randomNum, partenaire) =>  {
    let dejaJoueAvecIndex = this.dejaPartenaires[randomNum].findIndex(item => item === partenaire)
    if (dejaJoueAvecIndex !== -1) {
      console.log('Joueur deja partenaires');
      this.incompatibleMatch.push(randomNum);
      return 1;
    }
    return 0;
  }
  
  //Test si randomNum a déjà jouer contre joueur 1 ou joueur 2 dans une manche précédente
  _testDejaJouerContre = (randomNum, joueurAdverse) =>  {
    if (this.dejaJouerContre[randomNum] !== undefined) {
      let dejaJoueContreIndex = this.dejaJouerContre[randomNum].findIndex(item => item.joueur === joueurAdverse)
      if (dejaJoueContreIndex !== -1) {
        console.log('Joueur à déjà joué un joueur en face comme adversaire')
        this.incompatibleMatch.push(randomNum);
        return 1;
      }
    }
    return 0;
  }
  */

  _lanceurGeneration() {
    let nbjoueurs = this.props.listeJoueurs.length;
    let nbGenerationsRatee = 0
    let nbEssaisPossibles = Math.pow(nbjoueurs, nbjoueurs)
    let returnType = 0
    // 3 types de retour possible: 
    // 0 si trop de personnes spéciaux ou règle pas memeEquipes impossible; 
    // 1 si breaker activé
    // 2 si génération réussie
    //Tant que la génération échoue à cause du breaker alors on relancer
    while (nbGenerationsRatee < nbEssaisPossibles) {
      returnType = this._generation()
      if (returnType == 0 || returnType == 2) {
        break
      }
      else {
        nbGenerationsRatee++
      }
    }
    //Si la génération échoue trop de fois à cause du breaker alors affichage d'un message pour indiquer de changer les options
    if (nbGenerationsRatee == nbEssaisPossibles) {
      this.setState({
        isGenerationSuccess: false,
        isLoading: false
      })
    }
  }

  _generation() {
    let nbjoueurs = this.props.listeJoueurs.length;
    let nbManches = 5;
    let speciauxIncompatibles = true
    let jamaisMemeCoequipier = true;
    let eviterMemeAdversaire = true;
    let matchs = [];
    let idMatch = 0;
    let joueursSpe = [];
    let joueursNonSpe = [];
    let joueurs = [];

    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        nbManches = routeparams.nbTours
        this.nbTours = nbManches.toString()
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        speciauxIncompatibles = routeparams.speciauxIncompatibles
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles
      }
      if (routeparams.memesEquipes != undefined) {
        jamaisMemeCoequipier = routeparams.memesEquipes
        this.jamaisMemeCoequipier = routeparams.memesEquipes
      }
      if (routeparams.memesAdversaires != undefined) {
        eviterMemeAdversaire = routeparams.memesAdversaires
        this.eviterMemeAdversaire = routeparams.memesAdversaires
      }
    }

    //Initialisation des matchs dans un tableau
    let nbMatchs = nbManches * (nbjoueurs / 4)
    idMatch = 0;
    for (let i = 1; i < nbManches + 1; i++) {
      for (let j = 0; j < nbjoueurs / 4; j++) {
        matchs.push({id: idMatch, manche: i, joueur1: 0, joueur2: 0, joueur3: 0, joueur4: 0, score1: undefined, score2: undefined});
        idMatch++;
      }      
    }

    //Création d'un tableau contenant tous les joueurs, un autre les non spéciaux et un autre les spéciaux
    //Le tableau contenant les tous les joueurs permettra de connaitre dans quel équipe chaque joueur a été
    for (let i = 0; i < nbjoueurs; i++) {
      if (this.props.listeJoueurs[i].special === true) {
        joueursSpe.push(this.props.listeJoueurs[i]);
      }
      else {
        joueursNonSpe.push(this.props.listeJoueurs[i]);
      }
      joueurs.push(this.props.listeJoueurs[i]);
      joueurs[i].equipe = [];
    }

    //Assignation des joueurs spéciaux
    //Test si joueurs spéciaux ne sont pas trop nombreux
    if (joueursSpe.length <= nbjoueurs / 2) {
      //Joueurs spéciaux seront toujours joueur 1 ou joueur 3 si tous les joueurs 1 sont déjà spéciaux
      idMatch = 0;
      for (let i = 0; i < nbManches; i++) {
        for (let j = 0; j < joueursSpe.length; j++) {
          if (matchs[idMatch].joueur1 == 0) {
            matchs[idMatch].joueur1 = joueursSpe[j].id;
          }
          else if (matchs[idMatch].joueur3 == 0) {
            matchs[idMatch].joueur3 = joueursSpe[j].id;
          }
          idMatch++;
          if (idMatch > (nbjoueurs / 4) * (i + 1) - 1) {
            idMatch = i * (nbjoueurs / 4);
          }
        }
        idMatch = (nbjoueurs / 4) * (i + 1);
      }
    }
    //Si trop nombreux et règle est de ne pas les faire jouer ensemble alors message et retour à l'inscription
    else if (speciauxIncompatibles == true) {
      this.setState({
        erreurSpeciaux: true,
        isLoading: false
      })
      return 0
    }
    //Si trop nombreux mais règle désactivée alors les joueurs spéciaux et les non spéciaux sont regroupés
    else {
      joueursNonSpe.splice(0, joueursNonSpe.length)
      for (let i = 0; i < nbjoueurs; i++) {
        joueursNonSpe.push(this.props.listeJoueurs[i]);
      }
    }

    //Test si possible d'appliquer la règle jamaisMemeCoequipier
    //TO DO : réussir à trouver les bons paramètres pour déclencher le message d'erreur sans empecher trop de tournois
    if (jamaisMemeCoequipier == true) {
      let nbCombinaisons = nbjoueurs
      //Si option de ne pas mettre spéciaux ensemble alors moins de combinaisons possibles
      if (speciauxIncompatibles == true) {
        if (joueursSpe.length <= nbjoueurs / 2) {
          nbCombinaisons -= joueursSpe.length;
        }
      }
      //Si + de matchs que de combinaisons alors on désactive la règle de ne jamais faire jouer avec la même personne
      if (nbCombinaisons < nbManches) { //TODO message au-dessus
        this.setState({
          erreurMemesEquipes: true,
          isLoading: false
        })
        return 0
      }
    }

    //Test si possible d'appliquer la règle eviterMemeAdversaire
    //TODO
    //eviterMemeAdversaire = false;


    //On ordonne aléatoirement les ids des joueurs non spéciaux à chaque début de manche
    let joueursNonSpeId = [];
    for (let i = 0; i < joueursNonSpe.length; i++) {
      joueursNonSpeId.push(joueursNonSpe[i].id);
    }
    function shuffle(o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    //FONCTIONNEMENT
    //S'il y a eu des joueurs spéciaux avant alors ils ont déjà été affectés
    //On complète avec tous les joueurs non spéciaux
    //Pour conpléter remplissage des matchs tour par tour
    //A chaque tour les joueurs libres sont pris un par un dans une liste les triant aléatoirement à chaque début de tour
    //Ils sont ensuite ajouté si possible (selon les options) dans le 1er match du tour en tant que joueur 1
    //Si joueur 1 déjà pris alors joueur 2 et si déjà pris alors joueur 3 etc
    //Si impossible d'être ajouté dans le match alors tentative dans le match suivant du même tour
    //Si impossible dans aucun match du tour alors breaker rentre en action et affiche un message

    //Lors de l'affectation des joueurs 3 et 4 la règle aucun même adversaire est appliquée
    //Elle consiste à compter le nombre de fois que le joueur qui va être affecté à déjà jouer dans la même équipe ou contre le joueur 1 et 2
    //Si ce nombre est supérieur à la moitié inférieur du nombre de manche alors on passe au match du tour suivant
    //Exemple 5 manches: si joueur 8 à déjà joué 1 fois contre et 1 fois avec joueur 9 alors pas affecté en joueur 3 ou 4
    //Par contre possible que joueur 8 est déjà joué 2 fois contre joueur 9 et pourra après être avec joueur 9


    idMatch = 0;
    let breaker = 0 //permet de détecter quand boucle infinie
    for (let i = 0; i < nbManches; i++) {
      breaker = 0
      let random = shuffle(joueursNonSpeId);
      for (let j = 0; j < joueursNonSpe.length;) {
        //Affectation joueur 1
        if (matchs[idMatch].joueur1 == 0) {
          matchs[idMatch].joueur1 = random[j];
          j++
          breaker = 0
        }
        //Affectation joueur 2
        else if (matchs[idMatch].joueur2 == 0) {
          //Empeche que le joueur 1 joue plusieurs fois dans la même équipe avec le même joueur
          //Ne s'applique qu'à partir de la manche 2
          if (jamaisMemeCoequipier == true && i > 0) {
            if (joueurs[random[j] - 1].equipe.includes(matchs[idMatch].joueur1) == false) {
              matchs[idMatch].joueur2 = random[j];
              j++
              breaker = 0
            }
            else {
              breaker++
            }
          }
          else {
            matchs[idMatch].joueur2 = random[j];
            j++
            breaker = 0
          }
        }
        //Affectation joueur 3 & 4
        else if (matchs[idMatch].joueur3 == 0 || matchs[idMatch].joueur4 == 0) {
          //Test si le joueur 1 ou 2 n'a pas déjà joué (ensemble et contre) + de la moitié de ses matchs contre le joueur en cours d'affectation
          let affectationPossible = true
          if (eviterMemeAdversaire == true) {
            let moitieNbManches = Math.floor(nbManches / 2)
            let totPartiesJ1 = 0
            let totPartiesJ2 = 0
            let joueur1 = matchs[idMatch].joueur1
            let joueur2 = matchs[idMatch].joueur2
            //Compte le nombre de fois ou joueur 1 ou 2 a été l'adverse de joueur en affectation + ou bien si joueur 3 ou 4 a été l'adverse de joueur en affectation
            const occurrencesAdversaireDansEquipe1 = (arr, joueurAdverse, joueurAffect) => arr.reduce((a, v) => ((v.joueur1 === joueurAdverse || v.joueur2 === joueurAdverse) && (v.joueur3 === joueurAffect || v.joueur4 === joueurAffect) ? a + 1 : a), 0);
            const occurrencesAdversaireDansEquipe2 = (arr, joueurAdverse, joueurAffect) => arr.reduce((a, v) => ((v.joueur3 === joueurAdverse || v.joueur4 === joueurAdverse) && (v.joueur1 === joueurAffect || v.joueur2 === joueurAffect) ? a + 1 : a), 0);
            totPartiesJ1 += occurrencesAdversaireDansEquipe1(matchs, joueur1, random[j])
            totPartiesJ1 += occurrencesAdversaireDansEquipe2(matchs, joueur1, random[j])
            totPartiesJ2 += occurrencesAdversaireDansEquipe1(matchs, joueur2, random[j])
            totPartiesJ2 += occurrencesAdversaireDansEquipe2(matchs, joueur2, random[j])
            //+1 si joueur en cours d'affectation a déjà joué dans la même équipe
            totPartiesJ1 += joueurs[joueur1 - 1].equipe.includes(random[j]) ? 1 : 0
            totPartiesJ2 += joueurs[joueur2 - 1].equipe.includes(random[j]) ? 1 : 0
            if (totPartiesJ1 >= moitieNbManches || totPartiesJ2 >= moitieNbManches) {
              affectationPossible = false
            }
          }
          if (affectationPossible == true) {
            //Affectation joueur 3
            if (matchs[idMatch].joueur3 == 0) {
              matchs[idMatch].joueur3 = random[j];
              j++
              breaker = 0
            }
            //Affectation joueur 4
            else if (matchs[idMatch].joueur4 == 0) {
              //Empeche que le joueur 4 joue plusieurs fois dans la même équipe avec le même joueur
              //Ne s'applique qu'à partir de la manche 2
              if (jamaisMemeCoequipier == true && i > 0) {
                if (joueurs[random[j] - 1].equipe.includes(matchs[idMatch].joueur3) == false) {
                  matchs[idMatch].joueur4 = random[j];
                  j++
                  breaker = 0
                }
                else {
                  breaker++
                }
              }
              else {
                matchs[idMatch].joueur4 = random[j];
                j++
                breaker = 0
              }
            }
          }
          else {
            breaker++
          }
        }

        idMatch++;
        //Si l'id du Match correspond à un match du prochain tour alors retour au premier match du tour en cours
        if (idMatch >= (nbjoueurs / 4) * (i + 1)) {
          idMatch = i * (nbjoueurs / 4);
        }

        //En cas de trop nombreuses tentatives, arret de la génération
        //L'utilisateur est invité à changer les paramètres ou à relancer la génération
        //TODO condition de break à affiner
        //nbMatchs devrait être assez car le + opti devrait être : nbMatchs / nbManches
        if (breaker > nbMatchs) {
          return 1
        }
      }

      idMatch = i * (nbjoueurs / 4);
      for (let j = 0; j < nbjoueurs / 4; j++) {
        joueurs[matchs[idMatch + j].joueur1 - 1].equipe.push(matchs[idMatch + j].joueur2);
        joueurs[matchs[idMatch + j].joueur2 - 1].equipe.push(matchs[idMatch + j].joueur1);
        joueurs[matchs[idMatch + j].joueur3 - 1].equipe.push(matchs[idMatch + j].joueur4);
        joueurs[matchs[idMatch + j].joueur4 - 1].equipe.push(matchs[idMatch + j].joueur3);
      }
      idMatch = (nbjoueurs / 4) * (i + 1);
    }

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: 0,
      nbManches: nbManches,
      nbMatchs: nbMatchs,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire
    })

    //Ajout dans ke store
    this._ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading 
    this.setState({
      isLoading: false,
      isValid: true,
    })

    //Affichage des matchs
    this._displayListeMatch(matchs);

    //Si génération valide alors return 2
    return 2
  }

  _displayLoading() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color="#00ff00"/>
          <Text>Génération des parties, veuillez patienter</Text>
        </View>
      )
    }
  }

  _displayErrorGenerationFail() {
    if (this.state.isGenerationSuccess === false && this.state.isLoading === false) {
      return (
        <View style={styles.error_container}>
          <Text>La générations n'a pas réussie, certaines options rendent la génération trop compliqué.</Text>
          <Button title='Changer des options' onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _displayErreurSpeciaux() {
    if (this.state.erreurSpeciaux == true && this.state.isLoading == false) {
      return (
        <View style={styles.error_container}>
          <Text>La générations ne peux pas fonctionner avec les options.</Text>
          <Text>Il y a trop de Femmes et Enfants pour appliquer l'option de les faire jouer séparement</Text>
          <Button title="Désactiver l'option ou enlever des Enfants/Femmes" onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _displayErreurMemesEquipes() {
    if (this.state.erreurMemesEquipes == true && this.state.isLoading == false) {
      return (
        <View style={styles.error_container}>
          <Text>La générations ne peux pas fonctionner avec les options.</Text>
          <Text>Il y semble trop compliqué de ne jamais faire jouer des équipes identiques</Text>
          <Button title="Désactiver l'option ou rajouter des joueurs ou diminuer le nombre de tours" onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _retourInscription() {
    this.props.navigation.navigate({
      name: 'InscriptionStack',
      params: {
        nbTours: this.nbTours,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.jamaisMemeCoequipier,
        memesAdversaires: this.eviterMemeAdversaire
      }
    })
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayErreurSpeciaux()}
        {this._displayErreurMemesEquipes()}
        {this._displayErrorGenerationFail()}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  error_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%'
  },
})

const mapStateToProps = (state) => {
    return {
      listeJoueurs: state.toggleJoueur.listeJoueurs,
      listeMatchs: state.gestionMatchs.listematchs
    }
}

export default connect(mapStateToProps)(GenerationMatchs)