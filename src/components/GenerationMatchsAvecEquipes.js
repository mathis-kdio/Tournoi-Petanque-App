import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import { generationAvecEquipes } from 'utils/generations/tournoiAvecEquipes'

class GenerationMatchsAvecEquipes extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = 5
    this.nbPtVictoire = 13;
    this.speciauxIncompatibles = true
    this.jamaisMemeCoequipier = true
    this.eviterMemeAdversaire = true
    this.typeEquipes = "doublette"
    this.state = {
      isLoading: true,
      isValid: true,
      isGenerationSuccess: true,
      erreurSpeciaux: false,
      erreurMemesEquipes: false
    }
  }

  _ajoutMatchs = (matchs) => {
    //this._supprimerMatchs();
    const action = { type: "AJOUT_MATCHS", value: matchs }
    this.props.dispatch(action);
    const actionAjoutTournoi = { type: "AJOUT_TOURNOI", value: {tournoi: matchs} }
    this.props.dispatch(actionAjoutTournoi);
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

  _displayListeMatch() {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'ListeMatchsInscription'}],
    })
  }

  _lanceurGeneration() {
    let nbjoueurs = this.props.listesJoueurs.avecEquipes.length;
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
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.nbPtVictoire != undefined) {
        this.nbPtVictoire = routeparams.nbPtVictoire
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles
      }
      if (routeparams.memesEquipes != undefined) {
        this.jamaisMemeCoequipier = routeparams.memesEquipes
      }
      if (routeparams.memesAdversaires != undefined) {
        this.eviterMemeAdversaire = routeparams.memesAdversaires
      }
      if (routeparams.typeEquipes != undefined) {
        this.typeEquipes = routeparams.typeEquipes
      }
    }

    const {matchs, nbMatchs, echecGeneration} = generationAvecEquipes(this.props.listesJoueurs, this.nbTours, this.typeEquipes);
    if (echecGeneration) {
      return 1;
    }

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: undefined,
      nbTours: this.nbTours,
      nbPtVictoire: this.nbPtVictoire,
      nbMatchs: nbMatchs,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire,
      typeEquipes: this.typeEquipes,
      listeJoueurs: this.props.listesJoueurs.avecEquipes.slice()
    })

    //Ajout dans le store
    this._ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading 
    this.setState({
      isLoading: false,
      isValid: true,
    })

    //Affichage des matchs
    this._displayListeMatch(matchs);

    //Si génération valide alors return 2
    return 2;
  }

  _displayLoading() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color="#ffda00"/>
          <Text style={styles.texte}>Génération des parties, veuillez patienter</Text>
        </View>
      )
    }
  }

  _displayErrorGenerationFail() {
    if (this.state.isGenerationSuccess === false && this.state.isLoading === false) {
      return (
        <View style={styles.error_container}>
          <Text style={styles.texte}>La générations n'a pas réussie, certaines options rendent la génération trop compliqué.</Text>
          <Button title='Changer des options' onPress={() => this._retourInscription()}/>
        </View>
      )
    }
  }

  _retourInscription() {
    this.props.navigation.navigate({
      name: this.props.route.params.screenStackName,
      params: {
        nbTours: this.nbTours.toString(),
        nbPtVictoire: this.nbPtVictoire,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.jamaisMemeCoequipier,
        memesAdversaires: this.eviterMemeAdversaire,
        typeEquipes: this.state.typeEquipes
      }
    })
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayErrorGenerationFail()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
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
  texte: {
    fontSize: 15,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(GenerationMatchsAvecEquipes)