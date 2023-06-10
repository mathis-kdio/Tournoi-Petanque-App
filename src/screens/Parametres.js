import React from 'react'
import { StyleSheet, View, Button, Alert } from 'react-native'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import ChangelogData from '@assets/ChangelogData.json'
import { _openURL } from 'utils/link'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { HStack, VStack, Text, Spacer, FlatList, Divider, AlertDialog, Pressable, Box, Heading } from 'native-base'
import TopBarBack from 'components/TopBarBack'
import { FontAwesome5 } from '@expo/vector-icons';

class Parametres extends React.Component {
  constructor(props) {
    super(props)
    this.githubRepository = "https://github.com/sponsors/mathis-kdio";
  }

  _modalClearData() {
    Alert.alert(
      "Suppression des données",
      "Êtes-vous sûr de vouloir supprimer toutes les données (listes joueurs, anciens tournois, etc) ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._clearData() },
      ],
      { cancelable: true }
    );
    /*
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Suppression des données</AlertDialog.Header>
          <AlertDialog.Body>
            Êtes-vous sûr de vouloir supprimer toutes les données (listes joueurs, anciens tournois, etc) ?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                Annuler
              </Button>
              <Button colorScheme="danger" onPress={() => this._clearData()}>
                Confirmer
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      */
  }

  _clearData() {
    const actionRemoveAllPlayersAvecNoms = { type: "SUPPR_ALL_JOUEURS", value: ["avecNoms"] }
    this.props.dispatch(actionRemoveAllPlayersAvecNoms);
    const actionRemoveAllPlayersSansNoms = { type: "SUPPR_ALL_JOUEURS", value: ["sansNoms"] }
    this.props.dispatch(actionRemoveAllPlayersSansNoms);
    const actionRemoveAllPlayersAvecEquipes = { type: "SUPPR_ALL_JOUEURS", value: ["avecEquipes"] }
    this.props.dispatch(actionRemoveAllPlayersAvecEquipes);
    const actionRemoveAllPlayersHistorique = { type: "SUPPR_ALL_JOUEURS", value: ["historique"] }
    this.props.dispatch(actionRemoveAllPlayersHistorique);
    const actionRemoveAllPlayersSauvegarde = { type: "SUPPR_ALL_JOUEURS", value: ["sauvegarde"] }
    this.props.dispatch(actionRemoveAllPlayersSauvegarde);
    const actionRemoveAllSavedList = { type: "REMOVE_ALL_SAVED_LIST"}
    this.props.dispatch(actionRemoveAllSavedList);
    const actionRemoveAllTournaments = { type: "SUPPR_ALL_TOURNOIS"}
    this.props.dispatch(actionRemoveAllTournaments);
    const actionRemoveAllMatchs = { type: "REMOVE_ALL_MATCHS"}
    this.props.dispatch(actionRemoveAllMatchs);
    const actionRemoveAllTerrains = { type: "REMOVE_ALL_TERRAINS"}
    this.props.dispatch(actionRemoveAllTerrains);
    const actionRemoveAllOptions = { type: "SUPPR_ALL_OPTIONS"}
    this.props.dispatch(actionRemoveAllOptions);
  }

  _item(text, action, type) {
    let colorTxt = "white";
    let btnColor = "white"
    if (type == "danger") {
      colorTxt = "red.500";
      btnColor = "red"
    }
    return (
      <Pressable onPress={() => action}>
        <HStack m="2">
          <Text fontSize={16} color={colorTxt}>{text}</Text>
          <Spacer/>
          <FontAwesome5 name="arrow-right" size={20} color={btnColor}/>
        </HStack>
      </Pressable>
    )
  }

  _changelogItem(item) {
    let text = "Version "+item.version+" :";
    let action = () => console.log("press");
    return (
      <VStack>
        {this._item(text, action)}
        <Divider/>
      </VStack>
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title="Paramètres" navigation={this.props.navigation}/>
          <VStack flex="1" px="10">
            <VStack space="4">
              <Box borderWidth="1" borderColor="white" borderRadius="lg">
                {this._item("Voir le code source", () => _openURL(this.githubRepository))}
              </Box>
              <Box borderWidth="1" borderColor="red.500" borderRadius="lg">
                {this._item("Supprimer toutes les données", () => this._modalClearData(), "danger")}
              </Box>
            </VStack>
            <VStack flex="1">
              <Text textAlign="center" fontSize="xl" color="white">Liste des nouveautés</Text>
              <Text textAlign="center" fontSize="md" color="white">Version actuelle : {expo.version}</Text>
              <FlatList 
                data={ChangelogData}
                keyExtractor={(item) => item.id.toString() }
                renderItem={({item}) => this._changelogItem(item)}
                borderWidth="1"
                borderColor="white"
                borderRadius="lg"
              />
            </VStack>
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    savedLists: state.listesJoueurs.listesSauvegarde,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    listeTerrains: state.listeTournois.listeTerrains,
    optionsTournoi: state.optionsTournoi.options,
  }
}

export default connect(mapStateToProps)(Parametres)