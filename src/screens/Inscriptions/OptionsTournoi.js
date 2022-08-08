import React from 'react'
import { StyleSheet, View, TextInput, Text, Button } from 'react-native'
import CheckBox from 'react-native-check-box'
import { connect } from 'react-redux'
import { Picker } from '@react-native-picker/picker'

class OptionsTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.nbTours = "5"
    this.state = {
      speciauxIncompatibles: true,
      memesEquipes: true,
      memesAdversaires: true,
      complement: "3",
      nbTours: "5"
    }
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.setState({
          nbTours: routeparams.nbTours,
        })
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        this.setState({
          speciauxIncompatibles: routeparams.speciauxIncompatibles,
        })
      }
      if (routeparams.memesEquipes != undefined) {
        this.setState({
          memesEquipes: routeparams.memesEquipes,
        })
      }
      if (routeparams.memesAdversaires != undefined) {
        this.setState({
          memesAdversaires: routeparams.memesAdversaires,
        })
      }
      if (routeparams.complement != undefined) {
        this.setState({
          complement: routeparams.complement
        })
      }
    }
  }

  _optionsNombreToursTextInputChanged(text) {
    this.nbTours = text.toString()
    this.setState({
      nbTours: this.nbTours
    })
  }

  _retourInscription() {
    this.props.navigation.navigate({
      name: this.props.route.params.screenStackName,
      params: {
        nbTours: this.nbTours,
        speciauxIncompatibles: this.state.speciauxIncompatibles,
        memesEquipes: this.state.memesEquipes,
        memesAdversaires: this.state.memesAdversaires,
        complement: this.state.complement
      }
    })
  }

  _boutonValider() {
    let boutonActive = true
    let boutonTitle = "Vous devez indiquer un nombre de tours"
    if (this.state.nbTours != "" && this.state.nbTours != "0") {
      boutonTitle = 'Valider les options'
      boutonActive = false
    }
    return (
      <Button disabled={boutonActive} color='green' title={boutonTitle} onPress={() => this._retourInscription()}/>
    )
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container} >
          <View style={styles.input_nbtours_container}>
            <Text style={styles.texte}>Nombre de tours: </Text>
            <TextInput
              style={styles.textinput}
              placeholderTextColor='white'
              underlineColorAndroid='white'
              placeholder="Nombre de tours"
              keyboardType="numeric"
              defaultValue= {this.state.nbTours}
              onChangeText={(text) => this._optionsNombreToursTextInputChanged(text)}
              ref={this.addPlayerTextInput}
            />
          </View>
          <View style={styles.checkbox_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  speciauxIncompatibles: !this.state.speciauxIncompatibles
                })
              }}
              isChecked={this.state.speciauxIncompatibles}
              leftText={"Ne jamais faire jouer 2 enfants dans la même équipe"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
          <View style={styles.checkbox_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  memesEquipes: !this.state.memesEquipes
                })
              }}
              isChecked={this.state.memesEquipes}
              leftText={"Ne jamais former les mêmes équipes"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
          <View style={styles.checkbox_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  memesAdversaires: !this.state.memesAdversaires
                })
              }}
              isChecked={this.state.memesAdversaires}
              leftText={"Empecher 2 joueurs de jouer + de la moitié des matchs contre et ensemble"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
          <View style={styles.avecEquipes_container}>
            <Text style={styles.avecEquipes_texte}>En doublette, si le nombre de joueur n'est pas multiple de 4 alors les joueurs en trop seront mis en :</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.complement}
                onValueChange={(itemValue, itemIndex) => this.setState({complement: itemValue})}
                style={styles.picker}
                dropdownIconColor="white"
              >
                <Picker.Item label="Triplette" value="3"/>
                <Picker.Item label="Tête-à-Tête" value="1"/>
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.buttonView}>
          {this._boutonValider()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex:1,
    marginHorizontal: '5%'
  },
  input_nbtours_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox_container: {
    marginBottom: 10,
  },
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  texte: {
    fontSize: 15,
    color: 'white'
  },
  avecEquipes_container: {
    flex: 1,
    flexDirection: 'row'
  },
  avecEquipes_texte: {
    flex: 1,
    fontSize: 15,
    color: 'white'
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  picker: {
    color: 'white',
    width: 150
  }
})

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(OptionsTournoi)