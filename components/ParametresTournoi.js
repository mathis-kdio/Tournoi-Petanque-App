import React from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import { connect } from 'react-redux'


class ParametresTournoi extends React.Component {
  _showMatchs() {
    this.props.navigation.goBack();   
  }

  _supprimerTournoi() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS" }
    this.props.dispatch(suppressionAllJoueurs);
    const suppressionAllMatchs = { type: "SUPPR_MATCHS"}
    this.props.dispatch(suppressionAllMatchs);
    this.props.navigation.navigate('AccueilGeneral')
  }

  render() {
    let parametresTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1]
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container}>
          <View style={styles.options_container}>
            <Text style={styles.titre}>Les options du tournois :</Text>
            <Text style={styles.texte}>- Nombre de tours: {parametresTournoi.nbManches}</Text>
            <Text style={styles.texte}>- Les joueurs spéciaux ne peuvent pas être dans la même équipe : {parametresTournoi.speciauxIncompatibles.toString()}</Text>
            <Text style={styles.texte}>- Les joueurs ne peuvent pas jouer avec la même personne plusieurs fois : {parametresTournoi.memesEquipes.toString()}</Text>
            <Text style={styles.texte}>- Les joueurs ne peuvent pas jouer contre la même personne plusieurs fois : {parametresTournoi.memesAdversaires.toString()}</Text>
          </View>
          <View style={styles.bouton_container}>
            <View style={styles.buttonView}>
              <Button color='red' title='Supprimer le tournoi' onPress={() => this._supprimerTournoi()}/>
            </View>
            <View style={styles.buttonView}>
              <Button title='Retourner à la liste des parties' onPress={() => this._showMatchs()}/>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  body_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  options_container: {
    flex: 1,
    marginHorizontal: 40,
    justifyContent: 'center',
  },
  titre: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 24
  },
  texte: {
    marginBottom: 5,
    textAlign: 'justify',
    fontSize: 17
  },
  buttonView: {
    marginBottom: 60
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ParametresTournoi)