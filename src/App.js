import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FileSystem, MapView, Constants } from 'expo'
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
            borderRadius={5}
            title={'Download'}
            onPress={() => this.setState({ showDownloadSettings: true })}
          />
          <Button
            raised
            borderRadius={5}
            title={'Clear tiles'}
            onPress={this.clearTiles}
          />
          <Button
            raised
            borderRadius={5}
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
          initialRegion={{
            latitude: 69.6488069,
            longitude: 18.956678,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
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
