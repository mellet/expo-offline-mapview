export function tileGridForRegion(region, minZoom, maxZoom) {
  let tiles = []

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const subTiles = tilesForZoom(region, zoom)
    tiles = [...tiles, ...subTiles]
  }

  return tiles
}

function degToRad(deg) {
  return deg * Math.PI / 180
}
function lonToTileX(lon, zoom) {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom))
}

function latToTileY(lat, zoom) {
  return Math.floor(
    (1 - Math.log(Math.tan(degToRad(lat)) + 1 / Math.cos(degToRad(lat))) / Math.PI) /
      2 *
      Math.pow(2, zoom)
  )
}

function tilesForZoom(region, zoom) {
  const minLon = region.longitude - region.longitudeDelta
  const minLat = region.latitude - region.latitudeDelta
  const maxLon = region.longitude + region.longitudeDelta
  const maxLat = region.latitude + region.latitudeDelta

  let minTileX = lonToTileX(minLon, zoom)
  let maxTileX = lonToTileX(maxLon, zoom)
  let minTileY = latToTileY(maxLat, zoom)
  let maxTileY = latToTileY(minLat, zoom)

  let tiles = []

  for (let x = minTileX; x <= maxTileX; x++) {
    for (let y = minTileY; y <= maxTileY; y++) {
      tiles.push({ x, y, z: zoom })
    }
  }

  return tiles
}
