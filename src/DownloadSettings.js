import React from 'react'
import { StyleSheet, Text, View, Slider, ActivityIndicator } from 'react-native'
import { FileSystem, Constants } from 'expo'
import { Card, Button } from 'react-native-elements'
import { tileGridForRegion } from '../utilities/TileGrid'
import AppConstans from '../constants'

export default class DownloadSettings extends React.Component {
  constructor(props) {
    super(props)
    const initialZoom = this._calcZoom(this.props.mapRegion.longitudeDelta)

    this.state = {
      minZoom: initialZoom,
      maxZoom: initialZoom,
      isLoading: false,
      tileGrid: tileGridForRegion(this.props.mapRegion, initialZoom, initialZoom),
    }
  }

  _handleSliderChange = sliderValue => {
    const { mapRegion } = this.props

    const minZoom = this._calcZoom(mapRegion.longitudeDelta)
    const maxZoom = sliderValue
    const tileGrid = tileGridForRegion(mapRegion, minZoom, maxZoom)

    this.setState({ minZoom, maxZoom, tileGrid })
  }

  _fetchTiles = async () => {
    this.setState({ isLoading: true })

    const tiles = this.state.tileGrid

    const create_directories = tiles.map(tile => {
      const folder = `${AppConstans.TILE_FOLDER}/${tile.z}/${tile.x}`
      return FileSystem.makeDirectoryAsync(folder, {
        intermediates: true,
      })
    })

    await Promise.all(create_directories)

    const tile_downloads = tiles.map(tile => {
      const fetchUrl = `${AppConstans.MAP_URL}/${tile.z}/${tile.x}/${tile.y}.png`
      const localLocation = `${AppConstans.TILE_FOLDER}/${tile.z}/${tile.x}/${
        tile.y
      }.png`
      return FileSystem.downloadAsync(fetchUrl, localLocation)
    })

    const fileStatuses = await Promise.all(tile_downloads)
    console.log(`Downloaded ${fileStatuses.length} tiles`)

    this.setState({ isLoading: false })
    this.props.onSuccess()
  }

  _calcZoom = longitudeDelta => {
    return Math.round(Math.log(360 / longitudeDelta) / Math.LN2) + 2
  }

  render() {
    return (
      <Card title={'Select detail level'} containerStyle={styles.container}>
        <Text style={styles.warningMessage}>
          Warning! Selecting a high detail level will take up more space.
        </Text>

        <Slider
          step={1}
          minimumValue={this.state.minZoom}
          maximumValue={20}
          onValueChange={this._handleSliderChange}
        />

        <Text style={styles.estimate}>
          Estimated size: {this.state.tileGrid.length * 3 / 1000} Mb
        </Text>

        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button raised title="Dowload tiles" onPress={this._fetchTiles} />
        )}
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  warningMessage: {
    marginVertical: 10,
    color: '#bbb',
    fontStyle: 'italic',
    fontSize: 10,
    textAlign: 'center',
  },
  estimate: {
    marginVertical: 15,
    textAlign: 'center',
  },
})
