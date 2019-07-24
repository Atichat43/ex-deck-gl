import React, { Component, Fragment } from 'react'
import { DeckGL } from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'
import { GridCellLayer } from '@deck.gl/layers'
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

const data =[{point: [-122.41669, 37.7853], value: 100}, {point: [-122.42669, 37.7853], value: 50}]

const gridCellLayer = new GridCellLayer({
  id: 'grid-cell-layer',
  data,
  pickable: true,
  extruded: false,
  cellSize: 250,
  getPosition: d => d.point,
  getFillColor: d => [48, 128, d.value * 255, 255],
});

const layers = [gridCellLayer]

const getLayerOptions = () => {
  return layers.map(layer => {
    return { id: layer.id, label: layer.id.split('-').join(" ")}
  })
}

class MyMap extends Component {
  state = {
    mapStyle: "mapbox://styles/mapbox/light-v9",
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
    const newLayers = layers.filter(layer => layer.id === newOption.id ? newOption.value : true)
    this.renderDeckLayer(newLayers)
  }

  renderDeckLayer = (layers = []) => {
    const { deck } = this.deckGl
    deck.setProps({layers})
  }

  handleChangeMapStyle = styleId => {
    const { staticMap } = this
    const mapStyle = DEFAULT_MAP_STYLES.find(style => style.id === styleId).url
    this.setState(() => ({mapStyle}))
    staticMap.setStyle(mapStyle)
  }

  render() {
    const { mapStyle } = this.state

    return (
      <Fragment>
          <LayerManager 
            _updateConfig={this.handleUpdateConfig} 
            _changeMapStyle={this.handleChangeMapStyle}
            _updateLayer={this.handleUpdateLayer}
            layerOptions={getLayerOptions()}>
        </LayerManager>
        <DeckGL
          ref={ref => { this.deckGl = ref }}
          initialViewState={initialViewState}
          controller={true}
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