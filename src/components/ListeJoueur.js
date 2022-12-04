import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, Alert } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

class ListeJoueur extends React.Component {
  constructor(props) {
    super(props)
  }

  modifyList(savedList) {
    //const actionUpdateListeMatchs = {type: "AJOUT_MATCHS", value: tournoi.tournoi};
    //this.props.dispatch(actionUpdateListeMatchs);
  }

  _modalRemoveList(list) {
    Alert.alert(
      "Suppression d'une liste",
      "Êtes-vous sûr de vouloir supprimer la liste n°" + (list[list.length -1].listId + 1) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._removeList(list[list.length -1].listId) },
      ],
      { cancelable: true }
    );
  }

  _removeList(listId) {
    const actionRemoveList = {type: "REMOVE_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId}};
    this.props.dispatch(actionRemoveList);
  }

  _buttons(list) {
    if(this.props.route && this.props.route.params && this.props.route.params.loadListScreen) {
      return (
        <View style={styles.buttonView}>
          <Button color="#1c3969" title="Charger" onPress={() => this._loadList(list[list.length - 1].listId)}/>
        </View>
      )
    }
    else {
      return(
        <View style={styles.buttonContainer}>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Modifier" onPress={() => this.modifyList(list)}/>
          </View>
          <View style={styles.buttonView}>
            <Icon.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._modalRemoveList(list)}/>
          </View>
        </View>
      )
    }
  }

  _loadList(listId) {
    const actionLoadList = { type: "LOAD_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId} }
    this.props.dispatch(actionLoadList);
    this.props.navigation.goBack();
  }

  _listeJoueursItem(list) {
    return (
      <View style={styles.saved_list_container}>
        <Text style={styles.title_text}>Liste n°{list[list.length -1].listId + 1}</Text>
        {this._buttons(list)}
      </View>
    )
  }

  render() {
    const { savedLists } = this.props;
    return (
      <FlatList
        data={savedLists.avecNoms}
        initialNumToRender={20}
        keyExtractor={(item) => item[item.length - 1].listId.toString() }
        renderItem={({item}) => (this._listeJoueursItem(item))}
      />
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  saved_list_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  text_container: {
    flex: 1,
  },
  title_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonView: {
    marginHorizontal: 5
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
  }
}

export default connect(mapStateToProps)(ListeJoueur)