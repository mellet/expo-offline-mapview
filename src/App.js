import React from 'react'
import { StyleSheet, Text, View, Platform } from 'react-native'
import MapView from 'react-native-maps'
import * as FileSystem from 'expo-file-system'
import Constants from 'expo-constants';
import { Button } from 'react-native-elements'
import AppConstans from '../constants'
import DownloadSettings from './DownloadSettings'

export default class App extends React.Component {
  state = {
    isOffline: false,
    showDownloadSettings: false,
    urlTemplate: `${AppConstans.MAP_URL}/{z}/{x}/{y}.png`,
    offlineUrlTemplate: `${AppConstans.TILE_FOLDER}/{z}/{x}/{y}.png`,
    mapRegion: undefined,
  }

  clearTiles = async () => {
    try {
      await FileSystem.deleteAsync(AppConstans.TILE_FOLDER)
    } catch (error) {
      console.log('Tiles allready deleted')
    }
  }

  handleMapRegionChange = mapRegion => {
    this.setState({
      mapRegion,
    })
  }

  render() {
    const { isOffline, showDownloadSettings } = this.state
    const urlTemplate = isOffline
      ? this.state.offlineUrlTemplate
      : this.state.urlTemplate
    return (
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <Button
            raised
            title={'Download'}
            onPress={() => this.setState({ showDownloadSettings: !this.state.showDownloadSettings })}
          />
          <Button
            raised
            title={'Clear tiles'}
            onPress={this.clearTiles}
          />
          <Button
            raised
            title={isOffline ? 'Go online' : 'Go offline'}
            onPress={() => {
              isOffline
                ? this.setState({ isOffline: false })
                : this.setState({ isOffline: true })
            }}
          />
        </View>

        <MapView
          style={{ flex: 1 }}
          mapType={Platform.OS == "android" ? "none" : "standard"}
          initialRegion={{
            latitude: 21.3280192,
            longitude: -157.8692847,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}
          onRegionChange={this.handleMapRegionChange}>
          <MapView.UrlTile urlTemplate={urlTemplate} zIndex={1} />
        </MapView>

        {this.state.showDownloadSettings && (
          <DownloadSettings
            mapRegion={this.state.mapRegion}
            onSuccess={() => {
              this.setState({ showDownloadSettings: false })
            }}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    paddingTop: Constants.statusBarHeight + 15,
    zIndex: 999,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flex: 1,
  },
})
