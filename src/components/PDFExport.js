import React from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

class PDFExport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btnIsLoading: [false, false, false],
    }
  }

  calculClassement() {
    let victoires = []
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs
    for (let i = 0; i < listeJoueurs.length; i++) {
      let nbVictoire = 0;
      let nbPoints = 0;
      let nbMatchs = 0;
      let listeMatchs = this.props.listeMatchs
      for (let j = 0; j < listeMatchs[listeMatchs.length - 1].nbMatchs; j++) {
        if (listeMatchs[j].equipe[0].includes(i) && listeMatchs[j].score1) {
          if (listeMatchs[j].score1 == 13) {
            nbVictoire++;
            nbPoints += 13 - listeMatchs[j].score2;
          }
          else {
            nbPoints -= 13 - listeMatchs[j].score1;
          }
          nbMatchs++;
        }
        if (listeMatchs[j].equipe[1].includes(i) && listeMatchs[j].score2) {
          if (listeMatchs[j].score2 == 13) {
            nbVictoire++;
            nbPoints += 13 - listeMatchs[j].score1;
          }
          else {
            nbPoints -= 13 - listeMatchs[j].score2;
          }
          nbMatchs++;
        }
      }
      victoires[i] = {joueurId: i, victoires: nbVictoire, points: nbPoints, nbMatchs: nbMatchs, position: undefined};
    }
    victoires.sort(
      function(a, b) {          
        if (a.victoires === b.victoires) {
          return b.points - a.points;
        }
        return b.victoires - a.victoires;
      }
    );
    let position = 1;
    for (let i = 0; i < victoires.length; i++) {
      if(i > 0 && victoires[i-1].victoires === victoires[i].victoires && victoires[i-1].points === victoires[i].points) {
        victoires[i].position = victoires[i-1].position;
      }
      else {
        victoires[i].position = position;
      }
      position++;
    }
    return victoires
  }

  generatePDF = async (affichageScore, affichageClassement, buttonId) => {
    let toursParLigne = 3
    let nbTours = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbTours;
    let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
    let listeMatchs = this.props.listeMatchs;
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let nbMatchsParTour = nbMatchs / nbTours;
    let nbTables = Math.ceil(nbTours / toursParLigne);
    let nbToursRestants = nbTours;
    let html = `<!DOCTYPE html><html><head><style>@page{margin: 10px;} table{width: 100%;} table,th,td{border: 1px solid black;border-collapse: collapse;} td{min-width: 50px; word-break:break-all;} .td-score{min-width: 20px;} .text-right{text-align: right;} .text-center{text-align: center;} .no-border-top{border-top: none;} .no-border-bottom{border-bottom: none;} .border-top{border-top: 1px solid;}</style></head><body>
    <h1 class="text-center">Tournoi</h1>`;
    for (let tableIdx = 0; tableIdx < nbTables; tableIdx++) {
      let minTourTable = tableIdx * toursParLigne;
      html += '<table><tr>';
      let nbTourTable = toursParLigne;
      if (nbToursRestants < toursParLigne) {
        nbTourTable = nbToursRestants;
      }
      nbToursRestants -= toursParLigne; 
      for (let i = 1; i <= nbTourTable; i++) {
        html += '<th colspan="4">Tour n°' + (minTourTable + i) + '</th>';      
      }
      html += '</tr>';

      for (let i = 0; i < nbMatchsParTour; i++) {
        let matchNbJoueur = 1;
        if (listeMatchs[i].equipe[0][2] != -1) {
          matchNbJoueur = 3;
        }
        else if (listeMatchs[i].equipe[0][1] != -1) {
          matchNbJoueur = 2;
        }
        for (let jidx = 0; jidx < matchNbJoueur; jidx++) {
          if (jidx == 0) {
            html += '<tr class="border-top">';
          }
          else {
            html += '<tr class="">';
          }
          for (let j = 0; j < nbTourTable; j++) {
            let matchId = tableIdx * (toursParLigne * nbMatchsParTour) + j * nbMatchsParTour + i;
            //Joueur equipe 1
            html += '<td class="no-border-bottom no-border-top">';
            if (listeMatchs[matchId].equipe[0][jidx] != -1) {
              let joueur = listeJoueurs[listeMatchs[matchId].equipe[0][jidx]];
              if (joueur.name === undefined) {
                html += 'Sans Nom ('+ (joueur.id+1) +')';
              }
              else if (joueur.name == "") {
                html += 'Joueur '+ (joueur.id+1);
              }
              else {
                html += joueur.name +' ('+ (joueur.id+1) +')';
              }
            }
            html += '</td>';

            if (jidx == 0) {//Cases scores
              //score equipe 1
              html += '<td rowspan="'+ matchNbJoueur +'" class="td-score text-center">';
              if (affichageScore == true && listeMatchs[matchId].score1) {
                html += listeMatchs[matchId].score1;
              }
              html += '</td>';
              //score equipe 2
              html += '<td rowspan="'+ matchNbJoueur +'" class="td-score text-center">';
              if (affichageScore == true && listeMatchs[matchId].score2) {
                html += listeMatchs[matchId].score2;
              }
              html += '</td>';
            }

            //Joueur equipe 2
            html += '<td class="text-right no-border-bottom no-border-top">';
            if (listeMatchs[matchId].equipe[1][jidx] != -1) {
              let joueur = listeJoueurs[listeMatchs[matchId].equipe[1][jidx]];
              if (joueur.name === undefined) {
                html += 'Sans Nom ('+ (joueur.id+1) +')';
              }
              else if (joueur.name == "") {
                html += 'Joueur '+ (joueur.id+1);
              }
              else {
                html += joueur.name +' ('+ (joueur.id+1) +')';
              }
            }
            html += '</td>';
          }
          html += '</tr>';
        }
      }
      html += '</tr></table><br>';
    }
    if (affichageClassement == true) {
      html += '<br><table><tr>';
      html += '<th>Place</th><th>Victoires</th><th>Matchs Joués</th><th>Points</th>';
      let classement = this.calculClassement();
      for (let i = 0; i < listeJoueurs.length; i++) {
        html += '<tr>';
        html += '<td>' + classement[i].position + ' - ';
        let joueur = listeJoueurs[classement[i].joueurId];
        if (joueur.name === undefined) {
          html += 'Sans Nom ('+ (joueur.id+1) +')';
        }
        else if (joueur.name == "") {
          html += 'Joueur '+ (joueur.id+1);
        }
        else {
          html += joueur.name +' ('+ (joueur.id+1) +')';
        }
        html += '</td>'
        html += '<td class="text-center">'+ classement[i].victoires +'</td>';
        html += '<td class="text-center">'+ classement[i].nbMatchs +'</td>';
        html += '<td class="text-center">'+ classement[i].points +'</td>';
        html += '</tr>';
      }
      html += '</tr></table>';
    }
    html += '</body></html>';
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      Sharing.shareAsync(uri).then(this._toggleLoading(buttonId));
    }
    else {
      this._toggleLoading(buttonId)
    }
  }

  _toggleLoading(buttonId) {
    let newBtnIsLoading = this.state.btnIsLoading
    newBtnIsLoading[buttonId] = !this.state.btnIsLoading[buttonId]
    this.setState({
      btnIsLoading: newBtnIsLoading
    })
  };

  _onPressExportBtn(buttonId, affichageScore, affichageClassement) {
    this._toggleLoading(buttonId)
    this.generatePDF(affichageScore, affichageClassement, buttonId)
  };

  _exportButton(buttonId, buttonText, affichageScore, affichageClassement) {
    return (
      <Pressable disabled={this.state.btnIsLoading[buttonId]} onPress={() => this._onPressExportBtn(buttonId, affichageScore, affichageClassement)}>
        <View style={{...styles.button, opacity: this.state.btnIsLoading[buttonId] ? 0.7 : 1}}>
          {this.state.btnIsLoading[buttonId] && <ActivityIndicator size="small" color="white" />}
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </Pressable>
    )
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.buttonView}>
            {this._exportButton(0, "Exporter en PDF (sans scores)", false, false)}
          </View>
          <View style={styles.buttonView}>
            {this._exportButton(1, "Exporter en PDF (avec scores)", true, false)}
          </View>
          <View style={styles.buttonView}>
            {this._exportButton(2, "Exporter en PDF (avec scores + classement)", true, true)}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#1c3969',
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: 0.25,
    color: 'white'
  },
});

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(PDFExport)