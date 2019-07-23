import React, { Component } from 'react'
import { DeckGL } from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'
import { GridCellLayer } from '@deck.gl/layers'
import MAPBOX_TOKEN from './constant'

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

class MyMap extends Component {
  handleLoadStaticMap = () => {
    const { staticMap, deckGl } = this
    const { id } = staticMap.getStyle().layers.find((layer) => layer.type === 'symbol')
    const layers = [gridCellLayer]
    const deck = deckGl.deck

    // staticMap.addLayer(gridCellLayer, id)
    
    deck.setProps({layers})
    console.log(staticMap.getStyle())
  }

  render() {
    return (
      <DeckGL
        ref={ref => { this.deckGl = ref }}
        initialViewState={initialViewState}
        controller={true}
      >
        <StaticMap
          ref={ref => { this.staticMap = ref && ref.getMap() }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onLoad={this.handleLoadStaticMap}
        >
        </StaticMap>
      </DeckGL>
    )
  }
}

export default MyMap