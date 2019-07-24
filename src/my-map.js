import React, { Component, Fragment } from 'react'
import { DeckGL } from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'
import { GridCellLayer, ScatterplotLayer } from '@deck.gl/layers'
import MAPBOX_TOKEN from './constant'
import LayerManager from './LayerManager'

import { DEFAULT_LAYER_GROUPS, DEFAULT_MAP_STYLES } from './default-settings';

const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const gridCellLayer = new GridCellLayer({
  id: 'grid-cell-layer',
  data: [{point: [-122.41669, 37.7853], value: 100}, {point: [-122.42669, 37.7853], value: 50}],
  visible: true,
  pickable: true,
  extruded: false,
  cellSize: 250,
  getPosition: d => d.point,
  getFillColor: d => [48, 128, d.value * 255, 255],
})

const scatterplotLayer = new ScatterplotLayer({
  id: 'scatterplot-layer',
  data: [
    {name: 'Colma', passengers: 200, coordinates: [-122.466233, 37.684638]},
    {name: 'Civic Center', passengers: 500, coordinates: [-122.413756,37.779528]},
  ],
  visible: false,
  pickable: true,
  opacity: 1,
  stroked: true,
  filled: true,
  radiusScale: 10,
  radiusMinPixels: 1,
  radiusMaxPixels: 100,
  lineWidthMinPixels: 1,
  getPosition: d => d.coordinates,
  getRadius: d => Math.sqrt(d.passengers),
  getFillColor: d => [255, 140, 0],
  getLineColor: d => [0, 0, 0],
})

const LAYERS = [gridCellLayer, scatterplotLayer]

const getLayerOptions = (layers=[]) => {
  console.log(layers)
  return layers.map(layer => {
    return { id: layer.id, label: layer.id, visible: layer.props.visible }
  })
}

const renderLayers = renderIds => {
  const layers = LAYERS.filter(layer => renderIds.find(r => r.id === layer.id).visible)
  console.log(layers[0].props)
  // layers[0].setProps({visible: false})
  return layers
}

class MyMap extends Component {
  state = {
    mapStyle: "mapbox://styles/mapbox/light-v9",
    renderIds: []
  }

  componentDidMount() {
    const renderIds = getLayerOptions(LAYERS)
    this.setState(() => ({renderIds}))
  }

  handleLoadStaticMap = () => {
    console.log('handleLoadStaticMap')
  }

  handleUpdateConfig = config => {
    const { staticMap } = this
    const slugFilter = DEFAULT_LAYER_GROUPS.find(lg => lg.slug === config.slug).filter
    const styles = staticMap.getStyle()

    styles.layers.filter(layer => {
      if (slugFilter(layer) !== null) 
        staticMap.setLayoutProperty(layer.id, 'visibility', 
          config.value ? 'visible': 'none')
    })
  }

  handleUpdateLayer = newOption => {
    // const newLayers = layers.filter(layer => layer.id === newOption.id ? newOption.value : true)
    // this.renderDeckLayer(newLayers)
  }

  // renderDeckLayer = (layers = []) => {
  //   const { deck } = this.deckGl
  //   deck.setProps({layers})
  // }

  handleChangeMapStyle = styleId => {
    const { staticMap } = this
    const mapStyle = DEFAULT_MAP_STYLES.find(style => style.id === styleId).url
    this.setState(() => ({mapStyle}))
    staticMap.setStyle(mapStyle)
  }

  render() {
    const { mapStyle, renderIds } = this.state

    return (
      <Fragment>
          <LayerManager 
            _updateConfig={this.handleUpdateConfig} 
            _changeMapStyle={this.handleChangeMapStyle}
            _updateLayer={this.handleUpdateLayer}
            layerOptions={getLayerOptions(LAYERS)}>
        </LayerManager>
        <DeckGL
          ref={ref => { this.deckGl = ref }}
          initialViewState={initialViewState}
          controller={true}
          layers={renderIds.length !== 0 && renderLayers(renderIds)}
        >
          <StaticMap
            ref={ref => { this.staticMap = ref && ref.getMap() }}
            mapStyle={mapStyle}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onLoad={this.handleLoadStaticMap}
          >
          </StaticMap>
        </DeckGL>
      </Fragment>
    )
  }
}

export default MyMap