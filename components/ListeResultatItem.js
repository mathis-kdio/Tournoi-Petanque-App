import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

class ListeResultatItem extends React.Component {

  _displayName = (joueurNumber) => {
    let nomJoueur = {};
    nomJoueur = this.props.listeJoueurs.find(item => item.id === joueurNumber)
    if(nomJoueur === undefined) {
      return (
        <Text style={styles.joueurName} >manque J:{joueurNumber}</Text>
      )
    }
    else {
      return (
      <Text style={styles.joueurName} >{nomJoueur.name}</Text>
      )
    }
  }

  _fanny(joueurNumber) {
    let listeMatchs = this.props.listeMatchs
    let fanny = false
    let nbFanny = 0
    for (let i = 0; i < listeMatchs.length; i++) {
      if ((listeMatchs[i].joueur1 == joueurNumber || listeMatchs[i].joueur2 == joueurNumber) && listeMatchs[i].score1 == '0') {
        fanny = true
        nbFanny++
      }
      else if ((listeMatchs[i].joueur3 == joueurNumber || listeMatchs[i].joueur4 == joueurNumber) && listeMatchs[i].score2 == '0') {
        fanny = true
        nbFanny++
      }
    }
    if (fanny == true) {
      return (
        <View style={styles.fanny_container}>
          <Image source={require('../images/fanny.png')} style={styles.icon}/>
          <Text>X{nbFanny}</Text>
        </View>
      )
    }
  }

  render() {
    let { joueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.position_container}>
          <Text style={styles.joueurName}>{joueur.position}</Text>
        </View>
        <View style={styles.nom_container}>
          {this._displayName(joueur.joueurId)}
        </View>
        <View style={styles.victoires_container}>
          <Text style={styles.joueurName}>Victoire(s): {joueur.victoires}</Text>
        </View>
        {this._fanny(joueur.joueurId)}
        <View style={styles.points_container}>
          <Text style={styles.joueurName}>point(s): {joueur.points}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  position_container: {
    marginLeft: '5%',
    marginRight: 5
  },
  nom_container: {
    flex: 1,
  },
  joueurName: {
    fontSize: 15,
    textAlign: 'left'
  },
  victoires_container: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  fanny_container: {
    flexDirection: 'row',
  },
  points_container: {
    marginRight: '5%',
  },
  icon: {
    width: 30,
    height: 30
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeResultatItem)